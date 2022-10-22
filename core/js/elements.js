export class ElementsUtils {
    constructor(components) {
        for (const [name, path] of Object.entries(components))
            this.create(name, path);
    }
    async create(name, path) {
        const html = await ElementsUtils.getHtml(path);
        const module = await ElementsUtils.getJs(path);
        ElementsUtils.setCss(path);

        class Custom extends HTMLElement {
            constructor() {
                super();
                this.innerHTML = html;
                module?.default?.(this);
            }
        }
        customElements.define(name, Custom);
    }

    static async getHtml(path) {
        return await fetch(path + ".html")
            .then(t => t.text())
            .then(t => t.replaceAll(/<.*template>/g, ''));
    }
    static setCss(path) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = path + ".css";
        document.head.appendChild(link);
    }
    static removeCss(path) {
        [...document.head.getElementsByTagName("link")].forEach(el =>{
            if(el.href === path){
                document.head.removeChild(el);
                return;
            }
        });
    }
    static async getJs(path) {
        return await import(path + ".js");
    }
}