// types definition for threejs earcut
declare module 'three/src/extras/earcut' {
    export namespace Earcut {
        export function triangulate(
            vertices: ArrayLike<number>, 
            holes?: ArrayLike<number>, 
            dimensions?: number
        ): number[];
    }    
}
