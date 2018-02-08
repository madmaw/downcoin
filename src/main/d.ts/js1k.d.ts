// JS13k

declare var a: HTMLCanvasElement;
declare var b: HTMLBodyElement;
declare var c: CanvasRenderingContext2D;
declare var d: HTMLDocument;

// abs
declare var M: (n: number) => number;
// pi
declare var P: number;
// sin
declare var S: (a: number) => number;
// cos 
declare var C: (a: number) => number;
// canvas width
declare var W: number;
// canvas height
declare var H: number;

// coin x
declare var x: number;
// coin y
declare var y: number;
// coin velocity x
declare var v: number;
// coin velocity y
declare var w: number;
// coin radius
declare var r: number;

declare interface Point {
    x: number, 
    y: number,
    u: number, 
    v: number, 
    a: number, 
    d?: number
}
// surface
declare var s: Point[];

// then (previous time)
declare var t: number;
// time of last click
declare var T: number;
// last collision time
declare var L: number;
// diff time
declare var f: number;

// camera minX
declare var X: number;
// camera minY
declare var B: number;
// camera maxX
declare var V: number;

// last
declare var l: Point;

// angle
declare var A: number;
// point x
declare var q: number;
// point y
declare var k: number;
// generic number
declare var j: number;

// coinDX
declare var D: number;
// coin DY
declare var U: number;
// coinVAngle
declare var F: number;
// coinM
declare var G: number;

// pointNormalAngle
declare var O: number;
// deltaAngle
declare var Q: number;
// lineM
declare let K: number;
// lineC
declare let Z: number;

// dx
declare let e: number;
// dy
declare let z: number;
// sin
declare let h: number;
// cos
declare let g: number;

// temp x
declare let m: number;
// temp y
declare let n: number;
// leftOverX
declare let o: number;
// leftOverY
declare let p: number;
// update
declare let _: (n: number) => void;