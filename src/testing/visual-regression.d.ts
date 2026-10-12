// The package's types re-export `./browser/commands.mjs`, which TypeScript does
// not resolve to the neighbouring `commands.d.ts`, so the one function used is
// declared here.
declare module '@web/test-runner-visual-regression' {
  export function visualDiff(element: Node, name: string): Promise<void>;
}
