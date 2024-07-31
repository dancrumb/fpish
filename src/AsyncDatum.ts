import { Either } from "./Either.js";
import { Optional } from "./Optional.js";


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
  'Succeeded',
  /** @deprecated synonym for `Failed` */
  'Failure' = RemoteDataStatus.Failed,
  /** @deprecated synonym for `Succeeded` */
  'Success' = RemoteDataStatus.Succeeded,
}

/**
 * This class represents data from a remote source that takes time to load.
 * 
 * This data can be a single value or an array of values. Since there's no way to
 * infer the shape of the data, the caller is expected to know and to make the
 * appropriate calls
 *
 *
 * @template D A type representing the shape of data that is being requested
 * @template E A type representing the shape of errors that can be returned
 */
export class AsyncDatum<D, E = {}> {
  protected status: RemoteDataStatus = RemoteDataStatus.NotAsked;
  readonly #internal: Either<E, D>;

  constructor({
    status,
    data,
    error,
  }: {
    status: RemoteDataStatus;
    data?: D;
    error?: E;
  }) {
    this.status = status;
    if (data) {
      this.#internal = Either.right(data);
    } else if (error) {
      this.#internal = Either.left(error);
    } else {
      this.#internal = Either.right(Optional.empty());
    }
  }

  /**
   * Create an instance of this type that indicates that the request for async data
   * has not yet been made
   */
  static notAsked<ND, NE = {}>() {
    return new AsyncDatum<ND, NE>({
      status: RemoteDataStatus.NotAsked,
    });
  }

  /**
   * Create an instance of this type that indicates that a request is in flight but has not
   * yet completed
   */
  static loading<LD, LE = {}>() {
    return new AsyncDatum<LD, LE>({
      status: RemoteDataStatus.Loading,
    });
  }


  /**
   * Create an instance of this type that indicates that some data has been returned by the request.
   *
   * NB: There is nothing here that asserts that the request is complete. This factory method can
   * be called multiple times to indicate loading data in progress.
   *
   * @param data
   */
  static loaded<LD, LE = {}>(data :LD) {
    return new AsyncDatum<LD, LE>({
      status: RemoteDataStatus.Succeeded,
      data: Object.freeze(data),
    });
  }

  /**
   * Create an instance of this type that indicates that the requests has errored.
   * @param error
   */
  static errored<ED, EE = {}>(error: EE) {
    return new AsyncDatum<ED, EE>({
      status: RemoteDataStatus.Failure,
      error,
    });
  }


  /**
   * 
   * @returns true if this object currently contains retrievable data, i.e. not an error and not an inflight request
   */
  containsData() {
    return this.#internal.isRight();
  }

  /**
   * Check the status of the data request
   *
   * @param status
   */
  is(status: RemoteDataStatus) {
    return this.status === status;
  }

  /**
   * Check whether data has been requested
   */
  isAsked() {
    return !this.is(RemoteDataStatus.NotAsked);
  }

  /**
   * Check whether data is currently loading
   */
  isLoading() {
    return this.is(RemoteDataStatus.Loading);
  }

  /**
   * Check whether any data has loaded (or that the request has failed)
   */
  isLoaded() {
    return this.is(RemoteDataStatus.Succeeded) || this.is(RemoteDataStatus.Failed);
  }

  /**
   * Check whether the data errored out
   */
  isErrored() {
    return this.is(RemoteDataStatus.Failed);
  }


  /**
   *
   */
  value(): D {
    if (this.containsData()) {
      return this.#internal.getRight();
    }
    if (this.is(RemoteDataStatus.Failed)) {
      throw this.#internal.getLeft();
    }
    throw new Error('Trying to access AsyncDatum before it has data');
  }


  /**
   * Get the data as an optional and treat it as a single value
   */
  getOptional(): Optional<D> {
    return this.containsData() ? Optional.of(this.value()) : Optional.empty();
  }

  /**
   * Treats the data as an Optional and returns the internal
   * value or the provided value.
   *
   * @param v
   */
  orElse(v: D): typeof v {
    return this.getOptional().orElse(v);
  }

  
}
