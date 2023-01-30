import { type HierarchyNode } from "d3-hierarchy";
import { OrgChart, type Point } from "d3-org-chart";

export class LazyOrgChart<Datum extends {}> extends OrgChart<Datum> {

    loadChildren(): (d: Datum) => Promise<Datum[]>;
    //@ts-ignore
    loadChildren(func: (d: Datum) => Promise<Datum[]>): this;

    hasChildren(): (d: Datum) => boolean;
    //@ts-ignore
    hasChildren(func: (d: Datum) => boolean): this;

    public readonly getLazyLoadingAttrs: () => {
        loadChildren: (d: Datum) => Promise<Datum[]>;
        hasChildren: (d: Datum) => boolean;
    };

    // The attribute initialization is modeled after the one in the original library.
    constructor() {
        super();
        const l = {
            loadChildren: () => Promise.resolve([]),
            hasChildren: () => false,
        };
        this.getLazyLoadingAttrs = () => l;


        Object.keys(l).forEach((k) => {
            //@ts-ignore
            this[k] = function (t) { return t ? (l[k] = t, this) : l[k]; };
        });
    }

    // Based on addNode to avoid triggering an update after every single addition
    addNodes(nodes: Datum[]) {
        for (const obj of nodes) {
            const attrs = this.getChartState();
            if (attrs.allNodes.some(({ data }: { data: Datum; }) => attrs.nodeId(data) === attrs.nodeId(obj))) {
                console.log(`ORG CHART - ADD - Node with id "${attrs.nodeId(obj)}" already exists in tree`);
                return this;
            }
            if (!attrs.allNodes.some(({ data }: { data: Datum; }) => attrs.nodeId(data) === attrs.parentNodeId(obj))) {
                console.log(`ORG CHART - ADD - Parent node with id "${attrs.parentNodeId(obj)}" not found in the tree`);
                return this;
            }
            if ((obj as any)._centered && !(obj as any)._expanded)
                (obj as any)._expanded = true;
            attrs.data!.push(obj);
        }
        this.updateNodesState();
        return this;
    };

    override onButtonClick(e: MouseEvent, d: HierarchyNode<Datum>) {
        const attrs = this.getLazyLoadingAttrs();
        if (!d.children && !(d as any)._children && attrs.hasChildren(d.data)) {
            attrs.loadChildren(d.data)
                .then(nodes => {
                    this.addNodes(nodes.map(node => {
                        (node as any)._expanded = true;
                        return node;
                    }));
                    super.onButtonClick(e, d);
                });
        }
        else {
            super.onButtonClick(e, d);
        }
    }

    override update(params: { x0: number; y0: number; width: number; height: number; } & Partial<Point>) {
        super.update(params);
        for (const node of document.querySelectorAll(this.getChartState().container + " .node-button-g")) {
            if (node.querySelector(".node-button-div")?.childElementCount) {
                node.removeAttribute("display");
                node.removeAttribute("opacity");
            }
        }
    };
}
