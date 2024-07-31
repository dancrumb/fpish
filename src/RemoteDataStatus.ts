/**
 * The various states that an async request for data can be in
 */
export enum RemoteDataStatus {
  /** No request has been sent yet */
  'NotAsked',
  /** A request has been sent, but no response has been received */
  'Loading',
  /** A response has been received and it indicated an error */
  'Failed',
  /** A response has been received and it was successful */
  'Succeeded'
}
