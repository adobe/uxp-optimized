import fs from "fs";
import path from "path";

const reactSpectrumPath = "@react-spectrum/";

export default class ResolverPlugin {

    source;
	target;

	constructor(source = "resolve", target = "resolve") {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("MyResolverPlugin", (request, resolveContext, callback) => {
				// we no longer need this, it's just for debug.
				console.log(request.request + " => " + request.path);
				// return resolver.doResolve(target, newRequest, null, resolveContext, callback);
				callback();
			});
	}
}