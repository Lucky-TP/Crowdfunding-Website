import { DefaultResponse } from "./commonResponse";
import { PopularCreator } from "../datas/user";
import { UserData } from "../datas/user";

export interface GetUserResponse extends DefaultResponse {
    data?: UserData;
}

export interface EditUserResponse extends DefaultResponse {}

export interface GetTopTenCreatorResponse extends DefaultResponse {
    data: PopularCreator[];
}
