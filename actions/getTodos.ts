"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import {
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export interface OrgItem {
   id: number;
   orgName: string;
   Type: string;
   Status: string;
   Active: boolean;
   LastUpdated: string;
}

export const getOrgs = async () => {
  try {
    const data: ScanCommandOutput = await ddbDocClient.send(
      new ScanCommand({
        TableName: "Organizations",
        
      })
    );
    return (data.Items as OrgItem[]) || [];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database Error: Failed to get Todos.");
  }
};
