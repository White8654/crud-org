"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import { GetCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";

export interface OrgItem {
  id: number;
  orgName: string;
  Type: string;
  Status: string;
  Active: boolean;
  LastUpdated: string;
}

export const getOrg = async (id: number) => {
  try {
    const data: GetCommandOutput = await ddbDocClient.send(
      new GetCommand({
        TableName: "Organizations",
        Key: { id },
      })
    );
    
    if (!data.Item) {
      throw new Error(`Organization with id ${id} not found.`);
    }

    return data.Item as OrgItem;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Database Error: Failed to get Organization with id ${id}.`);
  }
};
