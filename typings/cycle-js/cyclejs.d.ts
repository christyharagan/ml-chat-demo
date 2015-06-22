/// <reference path="./virtual-dom.d.ts"/>
/// <reference path="../../node_modules/rx/ts/rx.d.ts"/>

declare module "cyclejs" {
  
  export interface CycleEvent<T> extends Event {
    data: T
    keyCode: number
  }

  export function h(selector: string, properties?: VirtualDom.HProps, children?: any[]|string): VirtualDom.VNode

  export interface Properties {
    get<T>(property: string): Rx.Observable<T>
  }

  export interface Interactions {
    get<T>(selector: string, eventType: string): Rx.Observable<CycleEvent<T>>
  }

	export interface CustomEvents {
		[event: string]: Rx.Observable<any>
	}
	
	export interface VTree extends Rx.Observable<VirtualDom.VNode> {
	}

	export interface CustomElement extends CustomEvents {
		vtree$: VTree
	}

	export interface AppliedToDOM {
		rootElem$: VTree
		interactions: Interactions
		dispose: () => void
		customEvents: CustomEvents
	}

  export function applyToDOM(container: String|HTMLElement, computer: (interactions: Interactions) => VTree): AppliedToDOM

  export function renderAsHTML(vtree$: VTree): Rx.Observable<string>

  export function registerCustomElement(tagName: string, definitionFn: (interactions: Interactions, properties: Properties) => CustomElement):void
	
}
