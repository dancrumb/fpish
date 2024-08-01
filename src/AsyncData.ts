import { AsyncDatum } from "./AsyncDatum.js";
import { RemoteDataStatus } from "./RemoteDataStatus.js";
import { Optional } from "./Optional.js";



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
export class AsyncData<D, E = {}> {
  protected status: RemoteDataStatus = RemoteDataStatus.NotAsked;
  readonly #internal: AsyncDatum< readonly D[], E>;

  private constructor({
    status,
    data,
    error,
  }: {
    status: RemoteDataStatus;
    data?: ReadonlyArray<D>;
    error?: E;
  }) {
    this.status = status;
    this.#internal = new AsyncDatum({
      status,
      data,
      error,
    });
    
  }

  /**
   * Create an instance of this type that indicates that the request for async data
   * has not yet been made
   */
  static notAsked<ND, NE = {}>() {
    return new AsyncData<ND, NE>({
      status: RemoteDataStatus.NotAsked,
    });
  }

  /**
   * Create an instance of this type that indicates that a request is in flight but has not
   * yet completed
   */
  static loading<LD, LE = {}>() {
    return new AsyncData<LD, LE>({
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
  static loaded<LD, LE = {}>(data: readonly LD[]) {
    return new AsyncData<LD, LE>({
      status: RemoteDataStatus.Succeeded,
      data: Object.freeze(data),
    });
  }

  /**
   * Create an instance of this type that indicates that the requests has errored.
   * @param error
   */
  static errored<ED, EE = {}>(error: EE) {
    return new AsyncData<ED, EE>({
      status: RemoteDataStatus.Failed,
      error,
    });
  }

  private cloneWithNewData<U>(data: ReadonlyArray<U>): AsyncData<U, E> {
    return new AsyncData<U, E>({
      status: this.status,
      data,
    });
  }

  /**
   * 
   * @returns true if this object currently contains retrievable data, i.e. not an error and not an inflight request
   */
  containsData() {
    return this.#internal.containsData();
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
   * Checks whether the data that was loaded is empty.
   *
   * This will throw an error if the data is not loaded yet
   *
   * @throws {NoSuchElementException}
   */
  isEmpty() {
    const value = this.value();
    return value.length === 0 || (value.length === 1 && value[0] === null);
  }

  /**
   *
   */
  value(): ReadonlyArray<D> {
    try {
    return this.#internal.value()
    } catch (e) {
      if (this.is(RemoteDataStatus.Failed)) {
        throw e;
      }
      throw new Error("Trying to access AsyncData before it has data",{cause:e});
    }
  }

  loadMore(): AsyncData<D, E> {
    if (this.containsData()) {
      return new AsyncData<D, E>({
        status: RemoteDataStatus.Loading,
        data: this.#internal.value(),
      });
    }

    return AsyncData.loading();
  }


  /**
   * Get the data as an optional and treat it as an array
   *
   * This will return any internal data that exists. As a result, it will
   * return data after a call to `loadMore`.
   */
  getOptional(): Optional<readonly D[]> {
    return this.containsData()
      ? Optional.of(this.#internal.value())
      : Optional.empty<D[]>();
  }


  /**
   * Treats the data as an Optional and returns the internal
   * value or the provided value.
   *
   * @param v
   */
  orElse(v: readonly D[]): typeof v {
    return this.getOptional().orElse(v);
  }

  append(v: D[]): AsyncData<D> {
    const currentData = this.containsData() ? this.#internal.value() : [];
    return AsyncData.loaded(currentData.concat(v));
  }

  /**
   * Standard response for mapping this AsyncData to a new one
   * when no data is loaded
   */
  private getNonLoadedResult<U>() {
    if (this.status === RemoteDataStatus.NotAsked) {
      return AsyncData.notAsked<U[], E>();
    }

    if (this.status === RemoteDataStatus.Loading && !this.containsData()) {
      return AsyncData.loading<U[], E>();
    }
  }

  map<U>(
    callbackfn: (value: D, index: number, array?: ReadonlyArray<D>) => U
  ): AsyncData<U, E> {
    return (
      this.getNonLoadedResult() ??
      this.cloneWithNewData(this.#internal.value().map(callbackfn))
    ) as AsyncData<U, E>;
  }

  mapValue<U>(
    callbackfn: (value: D, index: number, array?: ReadonlyArray<D>) => U
  ): ReadonlyArray<U> {
    return this.map(callbackfn).value();
  }

  filter(
    callbackfn: (value: D, index?: number, array?: ReadonlyArray<D>) => boolean
  ): AsyncData<D, E> {
    return (
      this.getNonLoadedResult() ??
      this.cloneWithNewData(this.#internal.value().filter(callbackfn))
    ) as AsyncData<D, E>;
  }

  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: D,
      currentIndex: number,
      array: ReadonlyArray<D>
    ) => U,
    initialValue: U
  ): AsyncData<U, E> {
    return (
      this.getNonLoadedResult() ??
      this.cloneWithNewData([
        this.#internal.value().reduce<U>(callbackfn, initialValue),
      ])
    ) as AsyncData<U, E>;
  }

  find(
    predicate: (value: D, index: number, obj: ReadonlyArray<D>) => boolean,
    thisArg?: unknown
  ): D | undefined {
    if (!this.containsData()) {
      return undefined;
    }

    return this.value().find(predicate, thisArg);
  }

  findIndex(
    predicate: (value: D, index: number, obj: ReadonlyArray<D>) => boolean,
    thisArg?: unknown
  ) {
    return this.value().findIndex(predicate, thisArg);
  }

  update(index: number, value: D) {
    const arr = this.value();
    if (index >= arr.length) {
      throw new RangeError(`Index ${index} is too large`);
    } else if (index < 0) {
      throw new RangeError(`Index ${index} is too small`);
    }

    return this.cloneWithNewData(Object.assign([...arr], { [index]: value }));
  }

  concat(...items: (D | ConcatArray<D>)[]) {
    return this.cloneWithNewData(this.value().concat(...items));
  }

  /**
   * Sorts the elements of data, according to `compareFn`
   * 
   * Note that this does not sort the elements in place
   * 
   * @param compareFn The comparison function to be applied to the data elements. See [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) documentation for more detail
   * 
   * 
   * @throws an error if no response has been received
   */
  sort(compareFn?: (a: D, b: D) => number) {
    return this.value().slice().sort(compareFn);
  }

  get(index: number) {
    return this.value()[index];
  }

  remove(index: number) {
    return this.filter((_, i) => i !== index);
  }

  /**
   * This returns `true` if the `predicate` returns `true` for every element of data.
   * 
   * It is synonymous with {@link every}
   * 
   * @throws an error if no response has been received
   */
  all(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.every(predicate);
  }

  /**
   * This returns `true` if the `predicate` returns `true` for every element of data.
   * 
   * It is synonymous with {@link all}
   * 
   * @throws an error if no response has been received
   */
  every(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.value().every(predicate);
  }

  /**
   * This returns `true` if the `predicate` returns `true` for any element of data.
   * 
   * It is synonymous with {@link some}
   * 
   * @throws an error if no response has been received
   */
  any(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.some(predicate);
  }

  /**
   * This returns `true` if the `predicate` returns `true` for any element of data.
   * 
   * It is synonymous with {@link any}
   * 
   * @throws an error if no response has been received
   */
  some(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.value().some(predicate);
  }
}
