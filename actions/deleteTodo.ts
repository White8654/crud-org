"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const deleteTodo = async (id: number) => {
  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: "todo",
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
