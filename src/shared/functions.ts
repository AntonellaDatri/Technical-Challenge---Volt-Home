import { customError } from "../config/exception-handler"

export const assertNotNull = (entity: any, message: string) => {
    if (entity === null) {
        customError(404, message)
    }
}
