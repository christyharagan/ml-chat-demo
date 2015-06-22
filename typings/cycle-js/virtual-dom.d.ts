declare module VirtualDom {
	interface VNode {
	}
	
	interface HProps {
		[index: string]: any
	}

	export function h(selector: string, properties?: HProps, children?: any[]): VNode	
}

declare module "virtual-dom" {
	export = VirtualDom
}