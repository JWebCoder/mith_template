import { UserModel } from '../database/mod.ts'
import { UserSchema } from '../database/users.ts'
import { debug } from '../deps.ts'
import { env } from '../utils/envLoader.ts'

const logger = debug(`${env.PROJECT_NAME}:controller-users`)

export default class Users {
  static async getById(id: number) {
    logger('get user: %d', id)
    return await UserModel.aggregate([
      {
        $match:{
          userId: {
            $eq: id
          }
        }
      },
      {
        $project:{
          password: 0,
        }
      }
    ])
  }

  static async getAll() {
    logger('get all users')
    return await UserModel.aggregate([
      {
        $project:{
          password: 0,
        }
      }
    ])
  }

  static async insert(user: Partial<UserSchema>) {
    logger('create a user')
    return await UserModel.insertOne(user)
  }

  static async delete(userId: number) {
    logger('deleting user')
    return await UserModel.deleteOne({
      userId,
    })
  }
}