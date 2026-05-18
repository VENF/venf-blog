import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  type GetCommandInput,
  type PutCommandInput,
  type QueryCommandInput,
  type UpdateCommandInput,
  type DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ENDPOINT && { endpoint: process.env.AWS_ENDPOINT }),
})

const docClient = DynamoDBDocumentClient.from(client)

export function createTableClient(tableName: string) {
  return {
    async get(pk: string, sk?: string) {
      const input: GetCommandInput = {
        TableName: tableName,
        Key: sk ? { PK: pk, SK: sk } : { PK: pk },
      }
      return docClient.send(new GetCommand(input))
    },

    async put(item: Record<string, unknown>) {
      const input: PutCommandInput = { TableName: tableName, Item: item }
      return docClient.send(new PutCommand(input))
    },

    async query(pk: string, options?: { skBeginsWith?: string; limit?: number }) {
      const input: QueryCommandInput = {
        TableName: tableName,
        KeyConditionExpression: options?.skBeginsWith
          ? 'PK = :pk AND begins_with(SK, :sk)'
          : 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': pk,
          ...(options?.skBeginsWith && { ':sk': options.skBeginsWith }),
        },
        Limit: options?.limit,
      }
      return docClient.send(new QueryCommand(input))
    },

    async update(pk: string, sk: string | undefined, updates: Record<string, unknown>) {
      const names: Record<string, string> = {}
      const values: Record<string, unknown> = {}
      const expressions: string[] = []
      let i = 0

      for (const [key, value] of Object.entries(updates)) {
        const nameKey = `#f${i}`
        const valueKey = `:v${i}`
        names[nameKey] = key
        values[valueKey] = value
        expressions.push(`${nameKey} = ${valueKey}`)
        i++
      }

      const input: UpdateCommandInput = {
        TableName: tableName,
        Key: sk ? { PK: pk, SK: sk } : { PK: pk },
        UpdateExpression: `SET ${expressions.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      }
      return docClient.send(new UpdateCommand(input))
    },

    async delete(pk: string, sk?: string) {
      const input: DeleteCommandInput = {
        TableName: tableName,
        Key: sk ? { PK: pk, SK: sk } : { PK: pk },
      }
      return docClient.send(new DeleteCommand(input))
    },
  }
}
