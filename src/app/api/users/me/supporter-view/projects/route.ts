import { NextRequest, NextResponse } from "next/server";
import { SupporterSummaryProjects } from "src/interfaces/datas/user";
import { StageStatus } from "src/interfaces/models/enums";
import { getProjects } from "src/libs/databases/firestore/projects";
import { getTransactionLogsByUserId } from "src/libs/databases/firestore/transactionLogs";
import { getUser, getUsers } from "src/libs/databases/firestore/users";
import { errorHandler } from "src/libs/errors/apiError";
import { StatusCode } from "src/constants/statusCode";
import { withAuthVerify } from "src/utils/api/auth";
import { ProjectModel } from "src/interfaces/models/project";
import { ExtendProjectPreview } from "src/interfaces/datas/project";

/**
 * @swagger
 * /api/users/me/supporter-view/projects:
 *   get:
 *     tags:
 *       - users
 *     summary: Retrieve summary projects for the authenticated user's supporter view
 *     description:
 *       This endpoint fetches summary projects for the authenticated user's supporter view,
 *       including favorited and contributed projects. The request requires authentication
 *       via a valid token in the cookies.
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched supporter view's summary projects
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal Server Error - An unexpected error occurred
 */

export const revalidate = 10;

export async function GET(request: NextRequest) {
    try {
        const tokenData = await withAuthVerify(request);
        const retrivedUser = await getUser(tokenData.uid);

        const contributedTransactions = await getTransactionLogsByUserId(retrivedUser.uid);
        const contributedProjectIds = contributedTransactions.map(({ projectId }) => projectId);

        const supportedProject = new Set(contributedTransactions.map(({ projectId }) => projectId))
        // console.log(supportedProject)
        const SupportMemSet : any = {}
        supportedProject.forEach((key)=>{
            // console.log("Key and values : ",key )
            contributedTransactions.map((transaction)=>{
                if (transaction.projectId === key){
                    if (SupportMemSet[key] === undefined){
                        SupportMemSet[key] = []
                        SupportMemSet[key].push(transaction)
                    }else{
                        const hasTransaction = SupportMemSet[key].some((existingTransaction : any ) => {
                            // Adjust this condition based on what makes the transaction unique
                            return existingTransaction.transactionId === transaction.transactionId;
                        });
            
                        // If transaction is not already in the list, push it
                        if (!hasTransaction) {
                            SupportMemSet[key].push(transaction);
                        }
                    }
                }
            })
        })
    
        console.log("Support meme set test : ",SupportMemSet)

        const [favoritedProjectModels, contributedProjectModels] = await Promise.all([
            getProjects(retrivedUser.favoriteProjectIds),
            getProjects(contributedProjectIds),
        ])

        const uidMappingToUsername: { [key: string]: string } = {};
        await getUsers(
            [
                ...favoritedProjectModels.map(({ uid }) => uid),
                ...contributedProjectModels.map(({ uid }) => uid),
            ],
            ({ uid, username }) => {
                uidMappingToUsername[uid] = username;
            }
        );
        const createExtendProjectPreview = (projectModel: ProjectModel): ExtendProjectPreview => ({
            projectId: projectModel.projectId,
            name: projectModel.name,
            projectOwnerUsername: uidMappingToUsername[projectModel.uid],
            previewImageUrl: projectModel.carouselImageUrls?.[0] ?? "",
            totalSupports: projectModel.totalSupporter,
            stages: projectModel.stages,
            currentStage: projectModel.stages.find(({ status }) => status === StageStatus.CURRENT)!,
            totalQuantity: projectModel.totalQuantity,
            costPerQuantity: projectModel.costPerQuantity,
        });
        const favoritedProjects = favoritedProjectModels.map(createExtendProjectPreview);
        const contributedProjects = contributedProjectModels.map(createExtendProjectPreview);
        const summaryProjects: SupporterSummaryProjects = {
            favorited: favoritedProjects,
            contributed: contributedProjects,
        };
        return NextResponse.json(
            {
                message: "Fetch supporter view's summary projects successful!",
                data: summaryProjects,
            },
            { status: StatusCode.SUCCESS }
        );
    } catch (error: unknown) {
        return errorHandler(error);
    }
}
