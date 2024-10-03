"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export interface OrgItem {
  id: number;
  orgName: string;
  Type: string;
  Status: string;
  Active: boolean;
  LastUpdated: string;
}

export const addOrg = async (orgName: string, type: string, status: string, active: boolean) => {
  try {
    const params = {
      TableName: "Organizations",
      Item: {
        id: Math.floor(Math.random() * 10000), // Generate a random ID
        orgName: orgName,                      // Use the orgName parameter
        Type: type,                            // Use the type parameter
        Status: status,                        // Use the status parameter
        Active: active,                        // Use the active parameter
        LastUpdated: new Date().toISOString(), // Set LastUpdated to current time
      },
    };

    await ddbDocClient.send(new PutCommand(params));
    console.log("Organization added successfully:", params.Item);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database Error: Failed to create organization.");
  }
};
