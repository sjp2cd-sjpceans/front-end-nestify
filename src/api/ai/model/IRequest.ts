import type { Mode, IMessage } from "./IMessage";

export interface IRequest {
  type: Mode
  system: IMessage
  user: IMessage
}