"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const deleteOrg = async (id: number) => {
  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: "Organizations",
        Key: {
          id: id,
        },
      })
    );
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Database Error: Failed to delete Todo."
    );
  }
};
