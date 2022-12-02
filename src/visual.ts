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

export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private canvas: HTMLCanvasElement;
    private canvas2: HTMLCanvasElement;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
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
            //this.canvas = document.createElement("canvas");
            //this.target.appendChild(this.canvas);
//
            //// Get the canvas element from the DOM.
            ////const canvas = /*document.getElementById("renderCanvas")*/ new_canvas as HTMLCanvasElement;
//
            //// Associate a Babylon Engine to it.
            //const engine = new Engine(this.canvas);
//
            //// Create our first scene.
            //var scene = new Scene(engine);
//
            //// This creates and positions a free camera (non-mesh)
            //var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
//
            //// This targets the camera to scene origin
            //camera.setTarget(Vector3.Zero());
//
            //// This attaches the camera to the canvas
            //camera.attachControl(this.canvas, true);
//
            //// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            //var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
//
            //// Default intensity is 1. Let's dim the light a small amount
            //light.intensity = 0.7;
//
            //// Create a grid material
            //var material = new GridMaterial("grid", scene);
//
            //// Our built-in 'sphere' shape.
            //var sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
//
            //// Move the sphere upward 1/2 its height
            //sphere.position.y = 2;
//
            //// Affect a material
            //sphere.material = material;
//
            //// Our built-in 'ground' shape.
            //var ground = CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene);
//
            //// Affect a material
            //ground.material = material;
//
            //// Render every frame
            //engine.runRenderLoop(() => {
            //    scene.render();
            //});
        }
    }

    public generateBarChart() {
        this.canvas2 = document.createElement("canvas");
        this.target.appendChild(this.canvas2);

        const engine = new Engine(this.canvas2);
        const scene = new Scene(engine);

        //// This creates and positions a free camera (non-mesh)
        //var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
//
        //// This targets the camera to scene origin
        //camera.setTarget(Vector3.Zero());
//
        //// This attaches the camera to the canvas
        //camera.attachControl(this.canvas, true);

        //// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        //var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
//
        //// Default intensity is 1. Let's dim the light a small amount
        //light.intensity = 0.7;

        //// Create a grid material
        //var material = new GridMaterial("grid", scene);
//
        //// Our built-in 'sphere' shape.
        //var sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
//
        //// Move the sphere upward 1/2 its height
        //sphere.position.y = 2;
//
        //// Affect a material
        //sphere.material = material;
//
        //// Our built-in 'ground' shape.
        //var ground = CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene);
//
        //// Affect a material
        //ground.material = material;


        const camera = new ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2.2, 20, new Vector3(0, 0, 0), scene);
        camera.attachControl(this.canvas2, true);
//
        const light1 = new HemisphericLight("light1", new Vector3(0, -1, 0), scene);
        light1.diffuse = new Color3(1, 1, 1);
        light1.specular = new Color3(0.01, 0.01, 0.01);
//
        ////if ( typeof TYPE === "undefined" ) {
        ////    fauxLoad();
        ////}
//
        let boxes = [];
        let textWriters = [];
        let lineSegments = [];
        let textMeshes = [];
        let axis_x;
        let axis_y;
        let axis_z;
        const environmentMainColor = new Color4(1, 1, 1);
        const scale = 1;
        const dataScale = 0.01;
        let highestHeight = 0;
        const defaultDistance = 0.5;
        const textDistance = -0.4;
        const distance = 0.05 + defaultDistance;
        const color = [new Color3(0.53, 0.97, 0.99), new Color3(1, 0.96, 0.58), new Color3(1, 0.39, 0.39)];
        const originalPoint = new Vector3(0, 0, 0);
        const spacing = 0.3;
        const zeroPointText = "0";
//
        const testData = {
            "xAxisTitle": "Day",
            "zAxisTitle": "Hour",
            "yAxisTitle": "People Visits",
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
//
        //const newTestData = {
        //    "xAxisTitle": "Day",
        //    "zAxisTitle": "Hour",
        //    "yAxisTitle": "People Visits",
        //    "measurementMax": 1000,
        //    "measurementSpan": 100,
        //    "dataArray": [{
        //        "xAxisData": 1,
        //        "zAxisArray": [{
        //            "zAxisData": 1,
        //            "yAxisData": 50
        //        }, {
        //            "zAxisData": 2,
        //            "yAxisData": 500
        //        }, {
        //            "zAxisData": 3,
        //            "yAxisData": 100
        //        }]
        //    }, {
        //        "xAxisData": 2,
        //        "zAxisArray": [{
        //            "zAxisData": 1,
        //            "yAxisData": 600
        //        }, {
        //            "zAxisData": 2,
        //            "yAxisData": 250
        //        }, {
        //            "zAxisData": 3,
        //            "yAxisData": 50
        //        }]
        //    }, {
        //        "xAxisData": 3,
        //        "zAxisArray": [{
        //            "zAxisData": 1,
        //            "yAxisData": 900
        //        }, {
        //            "zAxisData": 2,
        //            "yAxisData": 420
        //        }, {
        //            "zAxisData": 3,
        //            "yAxisData": 300
        //        }]
        //    }]
        //};
//
        let data = testData;
//
        const myPointsX = [
            originalPoint,
            new Vector3((data.dataArray.length + (data.dataArray.length - 1) * spacing + spacing + distance) * scale, 0, 0),
        ];
//
        const myPointsLineSegment0ToY = [
            originalPoint,
            new Vector3(0, spacing, 0),
        ];
//
        const myPointsLineSegment0ToZ = [
            originalPoint,
            new Vector3(0, 0, spacing),
        ];
//
        const myPointsLineSegment0ToX = [
            originalPoint,
            new Vector3(spacing, 0, 0),
        ];
//
        axis_x = MeshBuilder.CreateLines("lines", { points: myPointsX });
//
        const lineSegment0ToY = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToY });
        const lineSegment0ToZ = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToZ });
        const lineSegment0ToX = MeshBuilder.CreateLines("lines", { points: myPointsLineSegment0ToX });
//
        let Writer = MeshWriter(scene, { scale: scale, defaultFont: "Arial" });
        //write(zeroPointText, textDistance, textDistance, 0, null);  //make invisable
//
        createDataVisualization();
//
        //var boxes_mesh = Mesh.MergeMeshes(boxes, true, true, undefined, false, true);
        //textMeshes.forEach(item => item.parent = boxes_mesh);
        //lineSegments.forEach(item => item.parent = boxes_mesh);
        //axis_x.parent = boxes_mesh;
        //axis_y.parent = boxes_mesh;
        //axis_z.parent = boxes_mesh;
        //lineSegment0ToX.parent = boxes_mesh;
        //lineSegment0ToY.parent = boxes_mesh;
        //lineSegment0ToZ.parent = boxes_mesh;
//
        //var sixDofDragBehavior = new SixDofDragBehavior();
        //boxes_mesh.addBehavior(sixDofDragBehavior);
//
        function createDataVisualization() {
            data.dataArray.forEach((xAxisEle, xIndex) => {
                //write(xAxisEle.xAxisData.toString(), (xIndex + xIndex * spacing + distance), textDistance, 0, null);
//
                let lineSegment0ToYCopy = lineSegment0ToY.createInstance(null);
                lineSegment0ToYCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
                let lineSegment0ToZCopy = lineSegment0ToZ.createInstance(null);
                lineSegment0ToZCopy.position.x = (xIndex + xIndex * spacing + distance) * scale;
                lineSegments.push(lineSegment0ToYCopy);
                lineSegments.push(lineSegment0ToZCopy);
//
                xAxisEle.zAxisArray.forEach((zAxisEle, zIndex) => {
                    if (xIndex == 0) {
                        let lineSegment0ToXCopy = lineSegment0ToX.createInstance(null);
                        lineSegment0ToXCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
                        let lineSegment0ToYCopy = lineSegment0ToY.createInstance(null);
                        lineSegment0ToYCopy.position.z = (zIndex + zIndex * spacing + distance) * scale;
                        lineSegments.push(lineSegment0ToXCopy);
                        lineSegments.push(lineSegment0ToYCopy);
//
                        const myPointsZ = [
                            originalPoint,
                            new Vector3(0, 0, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance) * scale)
                        ]
                        axis_z = MeshBuilder.CreateLines("lines", { points: myPointsZ });
//
                        //write(data.zAxisTitle, textDistance, textDistance, (xAxisEle.zAxisArray.length + xAxisEle.zAxisArray.length * spacing + distance), null);
                        //write(zAxisEle.zAxisData.toString(), textDistance, textDistance, (zIndex + zIndex * spacing + distance), null);
                    }
//
                    let cubeHeight = zAxisEle.yAxisData * dataScale;
                    let box = MeshBuilder.CreateBox("box", { height: cubeHeight * scale, width: scale, depth: scale });
                    box.position = new Vector3((xIndex + xIndex * spacing + distance) * scale, cubeHeight * 0.5 * scale, (zIndex + zIndex * spacing + distance) * scale);
                    if (cubeHeight > highestHeight) {
                        highestHeight = cubeHeight;
                    }
//
                    let mat = new StandardMaterial("box_" + xIndex + "-" + zIndex + "_color", scene);
                    mat.alpha = 1;
                    mat.diffuseColor = color[zIndex];
                    box.material = mat;
                    box.material.alpha = 1;
//
                    boxes.push(box);
//
                });
            });
//
            const myPointsY = [
                originalPoint,
                new Vector3(0, Math.ceil(data.measurementMax * dataScale) * scale, 0),
            ];
            axis_y = MeshBuilder.CreateLines("lines", { points: myPointsY });
//
            for (let i = 0; i < Math.ceil(data.measurementMax / data.measurementSpan); i++) {
                if ((i + 1) * data.measurementSpan > data.measurementMax) {
                    let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
                    lineSegment0ToXCopyForY.position.y = data.measurementMax * dataScale * scale;
                    let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
                    lineSegment0ToZCopyForY.position.y = data.measurementMax * dataScale * scale;
                    lineSegments.push(lineSegment0ToXCopyForY);
                    lineSegments.push(lineSegment0ToZCopyForY);
//
                    //write(data.measurementMax + "", -0.2, (data.measurementMax * dataScale - 0.1), 0, "right");
                } else {
                    let lineSegment0ToXCopyForY = lineSegment0ToX.createInstance("lineSegment0ToXCopyforY" + i);
                    lineSegment0ToXCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
                    let lineSegment0ToZCopyForY = lineSegment0ToZ.createInstance("lineSegment0ToZCopyForY" + i);
                    lineSegment0ToZCopyForY.position.y = (i + 1) * data.measurementSpan * dataScale * scale;
                    lineSegments.push(lineSegment0ToXCopyForY);
                    lineSegments.push(lineSegment0ToZCopyForY);
//
                    //write((i + 1) * data.measurementSpan + "", -0.2, ((i + 1) * data.measurementSpan * dataScale - 0.1), 0, "right");
                }
//
            }
            //write(data.xAxisTitle, (data.dataArray.length + data.dataArray.length * spacing + distance), textDistance, 0, null);
            //write(data.yAxisTitle, textDistance, (Math.ceil(data.measurementMax * dataScale) + distance), 0, null);
        }
//
        function write(text, x, y, z, anchor) {
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

        // Render every frame
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    public update(options: VisualUpdateOptions) {

        this.canvas2.width=1024;
        this.canvas2.height=640;

        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

        console.log('Visual update', options);
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