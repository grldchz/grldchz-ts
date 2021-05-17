interface ServiceInit {
  status: 'init';
}

interface ServiceLoading {
  status: 'loading';
}

interface ServiceLoaded<T> {
  status: 'loaded';
  payload: T;
}

interface ServiceError {
  status: 'error';
  error: Error;
}

interface ServiceTerms {
  status: 'terms';
  error: Error;
}

interface ServicePerms {
  status: 'perms';
  error: Error;
}

export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError
  | ServiceTerms
  | ServicePerms;
