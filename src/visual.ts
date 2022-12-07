/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'; //Add
import { Color3, Color4 } from '@babylonjs/core/Maths'; //Add
import { MeshBuilder, Mesh } from '@babylonjs/core/Meshes'; //Add
import { MeshWriter, Writer } from 'meshwriter'; //Add
import { SixDofDragBehavior } from '@babylonjs/core/Behaviors'; //Add
import { StandardMaterial } from '@babylonjs/core'; //Add
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { Scene } from '@babylonjs/core/scene';

import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';


// Collect the methods
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Path2, Curve3 } from "@babylonjs/core/Maths/math.path";
import { CSG } from "@babylonjs/core/Meshes/csg";
import { PolygonMeshBuilder } from "@babylonjs/core/Meshes/polygonMesh";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";

// Put them in an object
const methodsObj = { Vector2, Vector3, Path2, Curve3, Color3, SolidParticleSystem, PolygonMeshBuilder, CSG, StandardMaterial, Mesh };

// Methods assembled, onward! 
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private canvas: HTMLCanvasElement;
    private canvas2: HTMLCanvasElement;

    private scene;
    private canvasOption = {
        "width": null, "height": null,
    };
    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.canvasOption.width = this.target.clientWidth;
        this.canvasOption.height = this.target.clientHeight;
        //this.target.setAttribute("width","640px");
        //this.target.setAttribute("height","320px");
        this.updateCount = 0;
        if (document) {
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Update3 count:"));
            const new_em: HTMLElement = document.createElement("em");
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);

            this.generateBarChart();
        }
    }

    public generateBarChart() {
        this.canvas2 = document.createElement("canvas");
        this.canvas2.width = this.target.clientWidth;
        this.canvas2.height = this.target.clientHeight;
        this.target.appendChild(this.canvas2);

        const engine = new Engine(this.canvas2);
        const scene = new Scene(engine);
        this.scene = scene;
        const camera = new ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 20, new Vector3(0, 0, 0), scene);
        camera.attachControl(this.canvas2, true);

        const light1 = new HemisphericLight("light1", new Vector3(0, -1, 0), scene);
        light1.diffuse = new Color3(1, 1, 1);
        light1.specular = new Color3(0.01, 0.01, 0.01);

        const light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
        light2.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
        light2.specular = new BABYLON.Color3(0.01, 0.01, 0.01);


        // let boxes = [];
        // let textWriters = [];
        // let lineSegments = [];
        // let textMeshes = [];
        // let axis_x;
        // let axis_y;
        // let axis_z;
        // const environmentMainColor = new Color4(1, 1, 1);
        // const scale = 1;
        // const dataScale = 0.01;
        // let highestHeight = 0;
        // const defaultDistance = 0.5;
        // const textDistance = -0.4;
        // const distance = 0.05 + defaultDistance;
        // const color = [new Color3(0.53, 0.97, 0.99), new Color3(1, 0.96, 0.58), new Color3(1, 0.39, 0.39)];
        // const originalPoint = new Vector3(0, 0, 0);
        // const spacing = 0.3;
        // const zeroPointText = "0";
        // const testData = {
        //     "xAxisTitle": "Year",
        //     "zAxisTitle": "Category ",
        //     "yAxisTitle": "Value",
        //     "measurementMax": 1000,
        //     "measurementSpan": 50,
        //     "dataArray": [{
        //         "xAxisData": 1,
        //         "zAxisArray": [{
        //             "zAxisData": 1,
        //             "yAxisData": 100
        //         }, {
        //             "zAxisData": 2,
        //             "yAxisData": 200
        //         }, {
        //             "zAxisData": 3,
        //             "yAxisData": 300
        //         }]
        //     }, {
        //         "xAxisData": 2,
        //         "zAxisArray": [{
        //             "zAxisData": 1,
        //             "yAxisData": 300
        //         }, {
        //             "zAxisData": 2,
        //             "yAxisData": 500
        //         }, {
        //             "zAxisData": 3,
        //             "yAxisData": 350
        //         }]
        //     }, {
        //         "xAxisData": 3,
        //         "zAxisArray": [{
        //             "zAxisData": 1,
        //             "yAxisData": 700
        //         }, {
        //             "zAxisData": 2,
        //             "yAxisData": 820
        //         }, {
        //             "zAxisData": 3,
        //             "yAxisData": 600
        //         }]
        //     }]
        // };
        // let data = testData;

        // const myPointsX = [
        //     originalPoint,
        //     new Vector3((data.dataArray.length + (data.dataArray.length - 1) * spacing + spacing + distance) * scale, 0, 0),
        // ];

        // const myPointsLineSegment0ToY = [
        //     originalPoint,
        //     new Vector3(0, spacing, 0),
        // ];

        // const myPointsLineSegment0ToZ = [
        //     originalPoint,
        //     new Vector3(0, 0, spacing),
        // ];

        // const myPointsLineSegment0ToX = [
        //     originalPoint,
        //     new Vector3(spacing, 0, 0),
        // ];

        // axis_x = MeshBuilder.CreateLines("lines", { points: myPointsX });

        // const lineSegment0ToY = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToY });
        // const lineSegment0ToZ = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToZ });
        // const lineSegment0ToX = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToX });


        // write(zeroPointText, textDistance, textDistance, 0, null);  //make invisable

        // //createDataVisualization();
        // createDataVisualization1()
        // function createDataVisualization1() {
        //     data.dataArray.forEach((xAxisEle, xIndex) => {
        //         write(xAxisEle.xAxisData.toString(), (xIndex + xIndex * spacing + distance), textDistance, 0, null);

        //         let lineSegment0ToYCopy = lineSegment0ToY.createInstance('');
        //         lineSegment0ToYCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
        //         let lineSegment0ToZCopy = lineSegment0ToZ.createInstance('');
        //         lineSegment0ToZCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
        //         lineSegments.push(lineSegment0ToYCopy);
        //         lineSegments.push(lineSegment0ToZCopy);

        //         xAxisEle.zAxisArray.forEach((zAxisEle, zIndex) => {
        //             if (xIndex == 0) {
        //                 let lineSegment0ToXCopy = lineSegment0ToX.createInstance('');
        //                 lineSegment0ToXCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
        //                 let lineSegment0ToYCopy = lineSegment0ToY.createInstance('');
        //                 lineSegment0ToYCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
        //                 lineSegments.push(lineSegment0ToXCopy);
        //                 lineSegments.push(lineSegment0ToYCopy);

        //                 const myPointsZ = [
        //                     originalPoint,
        //                     new Vector3(0, 0, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance) * scale)
        //                 ]
        //                 MeshBuilder.CreateLines("lines", { points: myPointsZ });

        //                 write(data.zAxisTitle, textDistance, textDistance, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance), null);
        //                 write(zAxisEle.zAxisData.toString(), textDistance, textDistance, (zIndex + zIndex * spacing + distance), null);
        //             }

        //             let cubeHeight = zAxisEle.yAxisData * dataScale;
        //             let box = MeshBuilder.CreateBox("box", { height: cubeHeight * scale, width: scale, depth: scale });
        //             box.position = new Vector3((xIndex + xIndex * spacing + distance) * scale, cubeHeight * 0.5 * scale, (zIndex + zIndex * spacing + distance) * scale);
        //             if (cubeHeight > highestHeight) {
        //                 highestHeight = cubeHeight;
        //             }

        //             let mat = new StandardMaterial("box_" + xIndex + "-" + zIndex + "_color", scene);
        //             mat.alpha = 1;
        //             mat.diffuseColor = color[zIndex];
        //             box.material = mat;
        //             box.material.alpha = 1;

        //             boxes.push(box);

        //         });
        //     });

        //     const myPointsY = [
        //         originalPoint,
        //         new Vector3(0, Math.ceil(data.measurementMax * dataScale) * scale, 0),
        //     ]
        //     MeshBuilder.CreateLines("lines", { points: myPointsY });

        //     for (let i = 0; i < Math.ceil(data.measurementMax / data.measurementSpan); i++) {
        //         if ((i + 1) * data.measurementSpan > data.measurementMax) {
        //             let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
        //             lineSegment0ToXCopyForY.position.y = data.measurementMax * dataScale * scale;
        //             let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
        //             lineSegment0ToZCopyForY.position.y = data.measurementMax * dataScale * scale;
        //             lineSegments.push(lineSegment0ToXCopyForY);
        //             lineSegments.push(lineSegment0ToZCopyForY);

        //             //data.measurementMax + "", -0.2, (data.measurementMax * dataScale - 0.1), 0, "right");
        //         } else {
        //             let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
        //             lineSegment0ToXCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
        //             let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
        //             lineSegment0ToZCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
        //             lineSegments.push(lineSegment0ToXCopyForY);
        //             lineSegments.push(lineSegment0ToZCopyForY);

        //             write((i + 1) * data.measurementSpan + "", -0.2, ((i + 1) * data.measurementSpan * dataScale - 0.1), 0, "right");
        //         }

        //     }
        //     write(data.xAxisTitle, (data.dataArray.length + data.dataArray.length * spacing + distance), textDistance, 0, null);
        //     write(data.yAxisTitle, textDistance, (Math.ceil(data.measurementMax * dataScale) + distance), 0, null);
        // }
        // function createDataVisualization() {
        //     data.dataArray.forEach((xAxisEle, xIndex) => {
        //         write(xAxisEle.xAxisData.toString(), (xIndex + xIndex * spacing + distance), textDistance, 0, null);
        //         //
        //         let lineSegment0ToYCopy = lineSegment0ToY.createInstance(null);
        //         lineSegment0ToYCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
        //         let lineSegment0ToZCopy = lineSegment0ToZ.createInstance(null);
        //         lineSegment0ToZCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
        //         lineSegments.push(lineSegment0ToYCopy);
        //         lineSegments.push(lineSegment0ToZCopy);
        //         //
        //         xAxisEle.zAxisArray.forEach((zAxisEle, zIndex) => {
        //             if (xIndex == 0) {
        //                 let lineSegment0ToXCopy = lineSegment0ToX.createInstance(null);
        //                 lineSegment0ToXCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
        //                 let lineSegment0ToYCopy = lineSegment0ToY.createInstance(null);
        //                 lineSegment0ToYCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
        //                 lineSegments.push(lineSegment0ToXCopy);
        //                 lineSegments.push(lineSegment0ToYCopy);
        //                 //
        //                 const myPointsZ = [
        //                     originalPoint,
        //                     new Vector3(0, 0, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance) * scale)
        //                 ]
        //                 axis_z = MeshBuilder.CreateLines("lines", { points: myPointsZ });
        //                 //
        //                 write(data.zAxisTitle, textDistance, textDistance, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance), null);
        //                 write(zAxisEle.zAxisData.toString(), textDistance, textDistance, (zIndex + zIndex * spacing + distance), null);
        //             }
        //             //
        //             let cubeHeight = zAxisEle.yAxisData * dataScale;
        //             let box = MeshBuilder.CreateBox("box", { height: cubeHeight * scale, width: scale, depth: scale });
        //             box.position = new Vector3((xIndex + xIndex * spacing + distance) * scale, cubeHeight * 0.5 * scale, (zIndex + zIndex * spacing + distance) * scale);
        //             if (cubeHeight > highestHeight) {
        //                 highestHeight = cubeHeight;
        //             }
        //             //
        //             let mat = new StandardMaterial("box_" + xIndex + "-" + zIndex + "_color", scene);
        //             mat.alpha = 1;
        //             mat.diffuseColor = color[zIndex];
        //             box.material = mat;
        //             box.material.alpha = 1;
        //             //
        //             boxes.push(box);
        //             //
        //         });
        //     });
        //     //
        //     const myPointsY = [
        //         originalPoint,
        //         new Vector3(0, Math.ceil(data.measurementMax * dataScale) * scale, 0),
        //     ];
        //     axis_y = MeshBuilder.CreateLines("lines", { points: myPointsY });
        //     //
        //     for (let i = 0; i < Math.ceil(data.measurementMax / data.measurementSpan); i++) {
        //         if ((i + 1) * data.measurementSpan > data.measurementMax) {
        //             let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
        //             lineSegment0ToXCopyForY.position.y = data.measurementMax * dataScale * scale;
        //             let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
        //             lineSegment0ToZCopyForY.position.y = data.measurementMax * dataScale * scale;
        //             lineSegments.push(lineSegment0ToXCopyForY);
        //             lineSegments.push(lineSegment0ToZCopyForY);
        //             //
        //             write(data.measurementMax + "", -0.2, (data.measurementMax * dataScale - 0.1), 0, "right");
        //         } else {
        //             let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
        //             lineSegment0ToXCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
        //             let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
        //             lineSegment0ToZCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
        //             lineSegments.push(lineSegment0ToXCopyForY);
        //             lineSegments.push(lineSegment0ToZCopyForY);
        //             //
        //             write((i + 1) * data.measurementSpan + "", -0.2, ((i + 1) * data.measurementSpan * dataScale - 0.1), 0, "right");
        //         }
        //         //
        //     }
        //     write(data.xAxisTitle, (data.dataArray.length + data.dataArray.length * spacing + distance), textDistance, 0, null);
        //     write(data.yAxisTitle, textDistance, (Math.ceil(data.measurementMax * dataScale) + distance), 0, null);
        // }


        // function write(text, x, y, z, anchor) {
        //     let Writer = MeshWriter(scene, { scale: scale, methods: methodsObj });
        //     //let Writer = MeshWriter(scene, { scale: scale, defaultFont: "Arial" });
        //     let textWriter = new Writer(
        //         text,
        //         {
        //             "anchor": anchor ? anchor : "center",
        //             "font-family": "Arial",
        //             "letter-height": 0.35,
        //             "letter-thickness": 0.05,
        //             "color": "#393939",
        //             "colors": {
        //                 "diffuse": "#393939",
        //                 "specular": "#393939",
        //                 "ambient": "#393939",
        //                 "emissive": "#393939",
        //             },
        //             "position": {
        //                 "x": x,
        //                 "y": y,
        //                 "z": z
        //             }
        //         }
        //     );
        //     let textMesh = textWriter.getMesh();
        //     textMeshes.push(textMesh);
        //     textMesh.rotation.x = -1.6;
        //     textWriters.push(textWriter);
        // };
        //this.create11111(null, scene);

        // Render every frame
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
    public create11111(dataArray, scene) {
        let boxes = [];
        let textWriters = [];
        let lineSegments = [];
        let textMeshes = [];
        let axis_x;
        let axis_y;
        let axis_z;
        const environmentMainColor = new Color4(1, 1, 1);
        const scale = 1;
        //const dataScale = 0.2;
        const dataScale = 10 / dataArray.measurementMax;
        let highestHeight = 0;
        const defaultDistance = 0.5;
        const textDistance = -0.4;
        const distance = 0.05 + defaultDistance;
        const color = [new Color3(0.53, 0.97, 0.99), new Color3(1, 0.96, 0.58), new Color3(1, 0.39, 0.39)];
        const originalPoint = new Vector3(0, 0, 0);
        const spacing = 0.3;
        const zeroPointText = "0";
        const testData = dataArray ? dataArray : {
            "xAxisTitle": "Year",
            "zAxisTitle": "Category ",
            "yAxisTitle": "Value",
            "measurementMax": 1000,
            "measurementSpan": 50,
            "dataArray": [{
                "xAxisData": 1,
                "zAxisArray": [{
                    "zAxisData": 1,
                    "yAxisData": 100
                }, {
                    "zAxisData": 2,
                    "yAxisData": 200
                }, {
                    "zAxisData": 3,
                    "yAxisData": 300
                }]
            }, {
                "xAxisData": 2,
                "zAxisArray": [{
                    "zAxisData": 1,
                    "yAxisData": 300
                }, {
                    "zAxisData": 2,
                    "yAxisData": 500
                }, {
                    "zAxisData": 3,
                    "yAxisData": 350
                }]
            }, {
                "xAxisData": 3,
                "zAxisArray": [{
                    "zAxisData": 1,
                    "yAxisData": 700
                }, {
                    "zAxisData": 2,
                    "yAxisData": 820
                }, {
                    "zAxisData": 3,
                    "yAxisData": 600
                }]
            }]
        };
        let data = testData;
        const myPointsX = [
            originalPoint,
            new Vector3((data.dataArray.length + (data.dataArray.length - 1) * spacing + spacing + distance) * scale, 0, 0),
        ];

        const myPointsLineSegment0ToY = [
            originalPoint,
            new Vector3(0, spacing, 0),
        ];

        const myPointsLineSegment0ToZ = [
            originalPoint,
            new Vector3(0, 0, spacing),
        ];

        const myPointsLineSegment0ToX = [
            originalPoint,
            new Vector3(spacing, 0, 0),
        ];

        axis_x = MeshBuilder.CreateLines("lines", { points: myPointsX });

        const lineSegment0ToY = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToY });
        const lineSegment0ToZ = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToZ });
        const lineSegment0ToX = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToX });


        write(zeroPointText, textDistance, textDistance, 0, null);  //make invisable
        data.dataArray.forEach((xAxisEle, xIndex) => {
            write(xAxisEle.xAxisData.toString(), (xIndex + xIndex * spacing + distance), textDistance, 0, null);

            let lineSegment0ToYCopy = lineSegment0ToY.createInstance('');
            lineSegment0ToYCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
            let lineSegment0ToZCopy = lineSegment0ToZ.createInstance('');
            lineSegment0ToZCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
            lineSegments.push(lineSegment0ToYCopy);
            lineSegments.push(lineSegment0ToZCopy);

            xAxisEle.zAxisArray.forEach((zAxisEle, zIndex) => {
                if (xIndex == 0) {
                    let lineSegment0ToXCopy = lineSegment0ToX.createInstance('');
                    lineSegment0ToXCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
                    let lineSegment0ToYCopy = lineSegment0ToY.createInstance('');
                    lineSegment0ToYCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
                    lineSegments.push(lineSegment0ToXCopy);
                    lineSegments.push(lineSegment0ToYCopy);

                    const myPointsZ = [
                        originalPoint,
                        new Vector3(0, 0, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance) * scale)
                    ]
                    MeshBuilder.CreateLines("lines", { points: myPointsZ });

                    write(data.zAxisTitle, textDistance, textDistance, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance), null);
                    write(zAxisEle.zAxisData.toString(), textDistance, textDistance, (zIndex + zIndex * spacing + distance), null);
                }

                let cubeHeight = zAxisEle.yAxisData * dataScale;
                let box = MeshBuilder.CreateBox("box", { height: cubeHeight * scale, width: scale, depth: scale });
                box.position = new Vector3((xIndex + xIndex * spacing + distance) * scale, cubeHeight * 0.5 * scale, (zIndex + zIndex * spacing + distance) * scale);
                if (cubeHeight > highestHeight) {
                    highestHeight = cubeHeight;
                }

                let mat = new StandardMaterial("box_" + xIndex + "-" + zIndex + "_color", scene);
                mat.alpha = 1;
                mat.diffuseColor = color[zIndex];
                box.material = mat;
                box.material.alpha = 1;

                boxes.push(box);

            });
        });

        const myPointsY = [
            originalPoint,
            new Vector3(0, Math.ceil(data.measurementMax * dataScale) * scale, 0),
        ]
        MeshBuilder.CreateLines("lines", { points: myPointsY });

        for (let i = 0; i < Math.ceil(data.measurementMax / data.measurementSpan); i++) {
            if ((i + 1) * data.measurementSpan > data.measurementMax) {
                let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
                lineSegment0ToXCopyForY.position.y = data.measurementMax * dataScale * scale;
                let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
                lineSegment0ToZCopyForY.position.y = data.measurementMax * dataScale * scale;
                lineSegments.push(lineSegment0ToXCopyForY);
                lineSegments.push(lineSegment0ToZCopyForY);

                //data.measurementMax + "", -0.2, (data.measurementMax * dataScale - 0.1), 0, "right");
            } else {
                let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
                lineSegment0ToXCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
                let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
                lineSegment0ToZCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
                lineSegments.push(lineSegment0ToXCopyForY);
                lineSegments.push(lineSegment0ToZCopyForY);

                write((i + 1) * data.measurementSpan + "", -0.2, ((i + 1) * data.measurementSpan * dataScale - 0.1), 0, "right");
            }

        }
        write(data.xAxisTitle, (data.dataArray.length + data.dataArray.length * spacing + distance), textDistance, 0, null);
        write(data.yAxisTitle, textDistance, (Math.ceil(data.measurementMax * dataScale) + distance), 0, null);

        function write(text, x, y, z, anchor) {
            let Writer = MeshWriter(scene, { scale: scale, methods: methodsObj });
            //let Writer = MeshWriter(scene, { scale: scale, defaultFont: "Arial" });
            let textWriter = new Writer(
                text,
                {
                    "anchor": anchor ? anchor : "center",
                    "font-family": "Arial",
                    "letter-height": 0.35,
                    "letter-thickness": 0.05,
                    "color": "#393939",
                    "colors": {
                        "diffuse": "#393939",
                        "specular": "#393939",
                        "ambient": "#393939",
                        "emissive": "#393939",
                    },
                    "position": {
                        "x": x,
                        "y": y,
                        "z": z
                    }
                }
            );
            let textMesh = textWriter.getMesh();
            textMeshes.push(textMesh);
            textMesh.rotation.x = -1.6;
            textWriters.push(textWriter);
        };
    }
    public transform(data) {
        //let optionsCategory = [];
        let optionsX = [];
        // for (let i = 0; i < data.length; i++) {
        //     optionsCategory.push(data[i][0]);
        // }
        for (let i = 0; i < data.length; i++) {
            optionsX.push(data[i][1]);
        }
        //let CategoryData = [...new Set(optionsCategory)];
        let xData = [...new Set(optionsX)];
        let dataArray = [];
        for (let i = 0; i < xData.length; i++) {
            let zAxisArray = [];
            for (let j = 0; j < data.length; j++) {
                if (data[j][1] === xData[i]) {
                    zAxisArray.push({
                        "zAxisData": data[j][0],
                        "yAxisData": data[j][2]
                    })
                }
            }
            dataArray.push({
                "xAxisData": xData[i],
                "zAxisArray": zAxisArray
            });
        }
        let testData = {
            "xAxisTitle": "Year",
            "zAxisTitle": "Category ",
            "yAxisTitle": "Value",
            "measurementMax": 50,
            "measurementSpan": 2,
            "dataArray": dataArray
        };
        this.create11111(testData, this.scene);
    }

    public update(options: VisualUpdateOptions) {

        // this.canvas2.width = 1024;
        // this.canvas2.height = 640;
        //this.canvas2 = this.canvasOption.width;

        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

        if (options.dataViews[0].table.columns.length === 3) {
            this.transform(options.dataViews[0].table.rows)
        }
        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }


}