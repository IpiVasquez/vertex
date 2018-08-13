import { Metapos } from 'api/app';

/**
 * Defines a Metapos Module. It receives an initializer function which
 * the Metapos app will execute.
 */
export class MetaposModule {
  constructor(public init: (app: Metapos) => Promise<any>) {}
}
