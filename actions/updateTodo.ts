"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export interface OrgItem {
  id: number;
  orgName: string;
  Type: string;
  Status: string;
  Active: boolean;
  LastUpdated: string;
}

export const updateOrg = async ({
  id,
  orgName,
  Type,
  Status,
  Active,
}: OrgItem) => {
  try {
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: "Organizations", // Use the correct table name
        Key: { id },
        UpdateExpression:
          "set orgName = :orgNameVal, #type = :typeVal, #status = :statusVal, Active = :activeVal, LastUpdated = :lastUpdatedVal",
        ExpressionAttributeNames: {
          "#type": "Type",
          "#status": "Status",
        },
        ExpressionAttributeValues: {
          ":orgNameVal": orgName,
          ":typeVal": Type,
          ":statusVal": Status,
          ":activeVal": Active,
          ":lastUpdatedVal": new Date().toISOString(), // Update LastUpdated to current time
        },
      })
    );

    console.log("Organization updated successfully:", { id, orgName, Type, Status, Active });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database Error: Failed to update organization.");
  }
};
