import { getContext, setContext } from 'svelte';

export function setController<T>(key: string | Symbol, impl: T): T {
	setContext(key, impl);
	return impl;
}

export function getController<T>(key: string | Symbol): () => T {
	return () => getContext(key) as T;
}

export function defineController<T>(key: string | Symbol = Symbol()): [() => T, (impl: T) => T] {
	return [
		getController<T>(key),
		(impl: T) => {
			setController(key, impl);
			return impl;
		}
	];
}
