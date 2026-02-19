/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Minimal IndexedDB Mock for Testing
const dbs: Record<string, any> = {};

const mockIndexedDB = {
  open: (name: string, version: number) => {
    const request: any = {
      result: null,
      error: null,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };

    setTimeout(() => {
      if (!dbs[name]) {
        dbs[name] = {
          name,
          version,
          objectStoreNames: {
            contains: (storeName: string) => !!dbs[name].stores[storeName],
          },
          stores: {},
          createObjectStore: (storeName: string, options: any) => {
            dbs[name].stores[storeName] = { data: [], keyPath: options.keyPath };
            return dbs[name].stores[storeName]; // Simplified return
          },
          transaction: (storeNames: string | string[], mode: string) => {
            const tx: any = {
              objectStore: (storeName: string) => {
                const store = dbs[name].stores[storeName];
                return {
                  add: (value: any) => {
                    store.data.push(value);
                    const req: any = { onsuccess: null, onerror: null, result: undefined };
                    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
                    return req;
                  },
                  put: (value: any) => {
                     store.data.push(value); // Simplified put (append)
                     const req: any = { onsuccess: null, onerror: null, result: undefined };
                     setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
                     return req;
                  },
                  getAll: () => {
                    const req: any = { onsuccess: null, onerror: null, result: store.data };
                    setTimeout(() => req.onsuccess && req.onsuccess({ target: req }), 0);
                    return req;
                  }
                };
              },
              oncomplete: null,
              onerror: null,
            };
            setTimeout(() => {
              if (tx.oncomplete) tx.oncomplete();
            }, 10);
            return tx;
          }
        };

        if (request.onupgradeneeded) {
           request.onupgradeneeded({ target: { result: dbs[name] } });
        }
      }

      request.result = dbs[name];
      if (request.onsuccess) {
        request.onsuccess({ target: request });
      }
    }, 0);

    return request;
  },
  deleteDatabase: (name: string) => {
    delete dbs[name];
    const request: any = { onsuccess: null, onerror: null, result: undefined };
    setTimeout(() => {
      if (request.onsuccess) request.onsuccess({ target: request });
    }, 0);
    return request;
  },
};

Object.defineProperty(window, "indexedDB", {
  value: mockIndexedDB,
});
