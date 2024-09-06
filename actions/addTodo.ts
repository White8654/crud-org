"use server";

import { ddbDocClient } from "@/utils/dbconfig";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export interface TodoItem {
  id: number;
  todo: string;
  status: boolean;
}

export const addTodo = async (todo: string) => {
  try {
    const params = {
      TableName: "todo",
      Item: {
        id: Math.floor(Math.random() * 10000),
        todo: todo,
        status: false,
      },
    };
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Database Error: Failed to create Todo."
    );
  }
};
