const sl = new SGL(innerWidth, innerHeight);

function Start(){}

// Pre-definations

SGL_DELAY = 1000 / 60; // 60 frames per second
SGL_FPS = 60;

let tick = 0;
const quality = 2;
let frameTime = 0;

function Loop()
{
    const lastPerformance = performance.now();
    sl.Ref();

    sl.Render(sl.Rect(vec2(0, 160), vec2(sl.width, sl.height - 300), albedo(0.3,0.6,0.6,1)));
    sl.Render(sl.Rect(vec2(0, sl.height - 140), vec2(sl.width, 140), albedo(0.8,0.8,0.6,1)));

    // Implementing stuff here

    testificate.render();

    for(let i = 0; i < quality; i ++)
    {
        testificate.update((1 / quality), i == 0);
    }

    sl.Render(sl.Text(vec2(40, 290), "Tick : " + tick, albedo(1,1,1,1)));

    frameTime = performance.now() - lastPerformance;
    sl.Render(sl.Text(vec2(40, 200), "DeltaTime : " + frameTime, albedo(1,1,1,1)));
    sl.Render(sl.Text(vec2(40, 230), "Potential : " + Math.round(1000 / frameTime), albedo(1,1,1,1)));
    sl.Render(sl.Text(vec2(40, 260), "FPS : " + SGL_FPS, albedo(1,1,1,1)));

    tick ++;
}

const testificate = physicsObject(
    [
        createMass(vec2(300, 300)),
        createMass(vec2(300, 400)),

        createMass(vec2(400, 400)),
        createMass(vec2(400, 300)),

        // createMass(vec2(350, 200)),
        
    ],
    [
        [0, 1], // Connection index for both points
        [1, 2], // Connection index for both points
        [2, 3], // Connection index for both points
        [3, 0], // Connection index for both points
        [0, 2], // Connection index for both points
        [1, 3], // Connection index for both points

        // [0, 4], // Connection index for both points
        // [3, 4], // Connection index for both points

        // [1, 4], // Connection index for both points
        // [2, 4], // Connection index for both points
    ],
    [
        100, // Rest distance between both of the points
        100, // Rest distance between both of the points
        100, // Rest distance between both of the points
        100, // Rest distance between both of the points
        sqrt(2) * 100, // Rest distance between both of the points
        sqrt(2) * 100, // Rest distance between both of the points

        111, // Rest distance between both of the points
        111, // Rest distance between both of the points
        // 206, // Rest distance between both of the points
        // 206, // Rest distance between both of the points
    ]
);