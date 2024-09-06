"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import {
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export interface TodoItem {
  id: number;
  todo: string;
  status: boolean;
}

export const getTodos = async () => {
  try {
    const data: ScanCommandOutput = await ddbDocClient.send(
      new ScanCommand({
        TableName: "todo",
        FilterExpression: "#status = :statusVal",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":statusVal": false,
        },
      })
    );
    return (data.Items as TodoItem[]) || [];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database Error: Failed to get Todos.");
  }
};
