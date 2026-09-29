/* ============================================================
   CLEANING CUBE
   ============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

const PEOPLE = [
    "Boel",
    "Elton",
    "Simon"
];


const ROOMS = [
    "Kitchen",
    "Bathroom",
    "Living Room"
];


/*
    3 cleaning days per week:

    Monday
    Wednesday
    Friday


    3-week rotation
*/


const ROTATIONS = [

    /* =========================
       WEEK 1
    ========================= */

    {
        Boel: "Kitchen",
        Elton: "Bathroom",
        Simon: "Living Room"
    },

    {
        Boel: "Bathroom",
        Elton: "Living Room",
        Simon: "Kitchen"
    },

    {
        Boel: "Living Room",
        Elton: "Kitchen",
        Simon: "Bathroom"
    },


    /* =========================
       WEEK 2
    ========================= */

    {
        Boel: "Bathroom",
        Elton: "Living Room",
        Simon: "Kitchen"
    },

    {
        Boel: "Living Room",
        Elton: "Kitchen",
        Simon: "Bathroom"
    },

    {
        Boel: "Kitchen",
        Elton: "Bathroom",
        Simon: "Living Room"
    },


    /* =========================
       WEEK 3
    ========================= */

    {
        Boel: "Living Room",
        Elton: "Kitchen",
        Simon: "Bathroom"
    },

    {
        Boel: "Kitchen",
        Elton: "Bathroom",
        Simon: "Living Room"
    },

    {
        Boel: "Bathroom",
        Elton: "Living Room",
        Simon: "Kitchen"
    }

];


/*
    Rotation 1 starts here.

    Monday,
    September 28, 2026
*/

const START_DATE = "2026-09-28";


/* ============================================================
   HTML ELEMENTS
============================================================ */

const cubeElement =
    document.getElementById("cube");


const assignmentsElement =
    document.getElementById("assignments");


const scheduleTable =
    document.getElementById("scheduleTable");


const dayNameElement =
    document.getElementById("dayName");


const dateTextElement =
    document.getElementById("dateText");


const statusElement =
    document.getElementById("status");


const nextButton =
    document.getElementById("nextBtn");


const resetButton =
    document.getElementById("resetBtn");


/* ============================================================
   DATE FUNCTIONS
============================================================ */

function dateKey(date) {

    return date
        .toISOString()
        .split("T")[0];

}


function parseDate(key) {

    const [
        year,
        month,
        day
    ] =
        key.split("-")
            .map(Number);


    return new Date(
        year,
        month - 1,
        day
    );

}


function addDays(date, amount) {

    const result =
        new Date(date);


    result.setDate(
        result.getDate() + amount
    );


    return result;

}


function weekdayIndex(date) {

    return date.getDay();

}


/*
    Monday = 1
    Wednesday = 3
    Friday = 5
*/

function isCleaningDay(date) {

    const day =
        weekdayIndex(date);


    return (
        day === 1 ||
        day === 3 ||
        day === 5
    );

}


/* ============================================================
   COUNT CLEANING DAYS
============================================================ */

function cleaningDaysBetween(
    start,
    target
) {

    let current =
        new Date(start);


    let count = 0;


    while (
        dateKey(current) !==
        dateKey(target)
    ) {

        current =
            addDays(
                current,
                1
            );


        if (
            isCleaningDay(
                current
            )
        ) {

            count++;

        }

    }


    return count;

}


/* ============================================================
   GET CURRENT ROTATION
============================================================ */

function getRotation(date) {

    /*
        Weekends have no cleaning.
    */

    if (
        !isCleaningDay(date)
    ) {

        return null;

    }


    const start =
        parseDate(
            START_DATE
        );


    const index =
        cleaningDaysBetween(
            start,
            date
        );


    return ROTATIONS[
        index %
        ROTATIONS.length
    ];

}


/* ============================================================
   NEXT CLEANING DAY
============================================================ */

function nextCleaningDay(date) {

    let next =
        addDays(
            date,
            1
        );


    while (
        !isCleaningDay(next)
    ) {

        next =
            addDays(
                next,
                1
            );

    }


    return next;

}


/* ============================================================
   ROOM CSS CLASS
============================================================ */

function roomClass(room) {

    if (
        room === "Kitchen"
    ) {

        return "kitchen";

    }


    if (
        room === "Bathroom"
    ) {

        return "bathroom";

    }


    if (
        room === "Living Room"
    ) {

        return "living";

    }


    return "off";

}


/* ============================================================
   DISPLAY ASSIGNMENTS
============================================================ */

function renderAssignments(date) {

    const rotation =
        getRotation(date);


    /*
        Weekend
    */

    if (!rotation) {

        assignmentsElement.innerHTML = `

            <div class="person boel">

                <div>

                    <div class="person-name">
                        No Cleaning
                    </div>

                    <small>
                        Weekend
                    </small>

                </div>

                <div class="room off">
                    💤
                </div>

            </div>

        `;

        return;

    }


    assignmentsElement.innerHTML =
        PEOPLE
            .map(person => {

                const room =
                    rotation[person];


                const personClass =
                    person
                        .toLowerCase();


                return `

                    <div
                        class="
                            person
                            ${personClass}
                        "
                    >

                        <div>

                            <div class="person-name">
                                ${person}
                            </div>

                        </div>

                        <div
                            class="
                                room
                                ${roomClass(room)}
                            "
                        >
                            ${room}
                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ============================================================
   WEEKLY TABLE
============================================================ */

function renderScheduleTable(date) {

    const rows = [];


    let current =
        new Date(date);


    /*
        Find Monday.
    */

    while (
        current.getDay() !== 1
    ) {

        current =
            addDays(
                current,
                -1
            );

    }


    /*
        Monday → Friday
    */

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const day =
            addDays(
                current,
                i
            );


        if (
            !isCleaningDay(day)
        ) {

            continue;

        }


        const rotation =
            getRotation(day);


        rows.push(`

            <tr>

                <td>
                    ${day.toLocaleDateString(
                        "en-US",
                        {
                            weekday:
                                "short"
                        }
                    )}
                </td>

                <td>
                    ${rotation.Boel}
                </td>

                <td>
                    ${rotation.Elton}
                </td>

                <td>
                    ${rotation.Simon}
                </td>

            </tr>

        `);

    }


    scheduleTable.innerHTML =
        rows.join("");

}


/* ============================================================
   UPDATE INFORMATION
============================================================ */

function updateInformation(date) {

    const day =
        date.toLocaleDateString(
            "en-US",
            {
                weekday:
                    "long"
            }
        );


    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );


    if (
        isCleaningDay(date)
    ) {

        dayNameElement.textContent =
            day;

    } else {

        dayNameElement.textContent =
            `${day} — No Cleaning`;

    }


    dateTextElement.textContent =
        formattedDate;


    renderAssignments(date);

    renderScheduleTable(date);

}


/* ============================================================
   RUBIK CUBE DATA
============================================================ */

let cubies = [];


function createCubies() {

    cubies = [];


    let id = 0;


    /*
        3 × 3 × 3 = 27 cubies
    */

    for (
        let x = -1;
        x <= 1;
        x++
    ) {

        for (
            let y = -1;
            y <= 1;
            y++
        ) {

            for (
                let z = -1;
                z <= 1;
                z++
            ) {

                cubies.push({

                    id:
                        id++,

                    x,
                    y,
                    z

                });

            }

        }

    }

}


/* ============================================================
   FRONT STICKER
============================================================ */

function frontSticker(
    cubie,
    date
) {

    /*
        Only the front layer
        contains cleaning information.
    */

    if (
        cubie.z !== 1
    ) {

        return `

            <div
                class="
                    face
                    front
                    rubik-blue
                "
            ></div>

        `;

    }


    const rotation =
        getRotation(date);


    /*
        Weekend
    */

    if (!rotation) {

        return `

            <div
                class="
                    face
                    front
                    off
                "
            >
                OFF
            </div>

        `;

    }


    /*
        Map cube rows to people:

        Top    = Boel
        Middle = Elton
        Bottom = Simon
    */

    const personIndex =
        1 - cubie.y;


    const person =
        PEOPLE[personIndex];


    const room =
        rotation[person];


    return `

        <div
            class="
                face
                front
                ${roomClass(room)}
            "
        >

            <div>

                <strong>
                    ${person}
                </strong>

                <br>

                ${room}

            </div>

        </div>

    `;

}


/* ============================================================
   CREATE ONE CUBIE
============================================================ */

function createCubieElement(
    cubie,
    date
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "cubie";


    const cell = 96;


    /*
        Convert cube coordinates
        to pixels.
    */

    const px =
        cubie.x * cell;


    const py =
        -cubie.y * cell;


    const pz =
        cubie.z * cell;


    element.style.transform = `

        translate3d(
            -50%,
            -50%,
            0
        )

        translate3d(
            ${px}px,
            ${py}px,
            ${pz}px
        )

    `;


    /*
        Build six faces.
    */

    element.innerHTML = `

        ${frontSticker(
            cubie,
            date
        )}


        <div
            class="
                face
                back
                ${
                    cubie.z === -1
                        ? "rubik-orange"
                        : ""
                }
            "
        ></div>


        <div
            class="
                face
                right
                ${
                    cubie.x === 1
                        ? "rubik-red"
                        : ""
                }
            "
        ></div>


        <div
            class="
                face
                left
                ${
                    cubie.x === -1
                        ? "rubik-orange"
                        : ""
                }
            "
        ></div>


        <div
            class="
                face
                top
                ${
                    cubie.y === 1
                        ? "rubik-yellow"
                        : ""
                }
            "
        ></div>


        <div
            class="
                face
                bottom
                ${
                    cubie.y === -1
                        ? "rubik-green"
                        : ""
                }
            "
        ></div>

    `;


    return element;

}


/* ============================================================
   RENDER CUBE
============================================================ */

function renderCube(
    date = new Date()
) {

    cubeElement.innerHTML = "";


    cubies.forEach(
        cubie => {

            const element =
                createCubieElement(
                    cubie,
                    date
                );


            element.dataset.id =
                cubie.id;


            cubeElement.appendChild(
                element
            );

        }
    );

}


/* ============================================================
   ROTATE CUBE COORDINATES
============================================================ */

function rotateCoordinate(
    cubie,
    axis,
    direction
) {

    const x = cubie.x;

    const y = cubie.y;

    const z = cubie.z;


    /* =========================
       X AXIS
    ========================= */

    if (
        axis === "x"
    ) {

        if (
            direction === 1
        ) {

            cubie.y =
                -z;

            cubie.z =
                y;

        } else {

            cubie.y =
                z;

            cubie.z =
                -y;

        }

    }


    /* =========================
       Y AXIS
    ========================= */

    if (
        axis === "y"
    ) {

        if (
            direction === 1
        ) {

            cubie.x =
                z;

            cubie.z =
                -x;

        } else {

            cubie.x =
                -z;

            cubie.z =
                x;

        }

    }


    /* =========================
       Z AXIS
    ========================= */

    if (
        axis === "z"
    ) {

        if (
            direction === 1
        ) {

            cubie.x =
                -y;

            cubie.y =
                x;

        } else {

            cubie.x =
                y;

            cubie.y =
                -x;

        }

    }

}


/* ============================================================
   LAYER ROTATION
============================================================ */

let turning = false;


function rotateLayer(
    axis,
    layer,
    direction
) {

    if (turning) {

        return Promise.resolve();

    }


    turning = true;


    return new Promise(
        resolve => {

            const group =
                document.createElement(
                    "div"
                );


            group.className =
                "layer-turn";


            /*
                Find the 9 cubies
                in the selected layer.
            */

            const selected =
                cubies.filter(
                    cubie =>
                        cubie[axis] ===
                        layer
                );


            /*
                Move those nine
                cubies into the
                rotating layer.
            */

            selected.forEach(
                cubie => {

                    const element =
                        [...cubeElement.children]
                            .find(
                                el =>
                                    Number(
                                        el.dataset.id
                                    ) ===
                                    cubie.id
                            );


                    if (element) {

                        group.appendChild(
                            element
                        );

                    }

                }
            );


            cubeElement.appendChild(
                group
            );


            /*
                Starting position.
            */

            group.style.transform =
                `rotate${axis.toUpperCase()}(0deg)`;


            /*
                Trigger real animation.
            */

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            group.style.transform =
                                `rotate${axis.toUpperCase()}(${direction * 90}deg)`;

                        }
                    );

                }
            );


            /*
                Wait for the
                90-degree rotation.
            */

            setTimeout(
                () => {

                    /*
                        Update logical
                        positions.
                    */

                    selected.forEach(
                        cubie => {

                            rotateCoordinate(
                                cubie,
                                axis,
                                direction
                            );

                        }
                    );


                    /*
                        Rebuild the cube.
                    */

                    group.remove();


                    renderCube(
                        simulatedDate
                    );


                    turning = false;


                    resolve();

                },

                950
            );

        }
    );

}


/* ============================================================
   WHICH LAYER ROTATES?
============================================================ */

function rotationForCleaningDay(
    date
) {

    const day =
        date.getDay();


    /*
        Monday
        Rotate top layer.
    */

    if (
        day === 1
    ) {

        return {

            axis:
                "y",

            layer:
                1,

            direction:
                1

        };

    }


    /*
        Wednesday
        Rotate right layer.
    */

    if (
        day === 3
    ) {

        return {

            axis:
                "x",

            layer:
                1,

            direction:
                -1

        };

    }


    /*
        Friday
        Rotate front layer.
    */

    if (
        day === 5
    ) {

        return {

            axis:
                "z",

            layer:
                1,

            direction:
                1

        };

    }


    return null;

}


/* ============================================================
   SIMULATED DATE
============================================================ */

let simulatedDate =
    new Date();


/* ============================================================
   NEXT CLEANING DAY
============================================================ */

async function nextCleaningDayAnimation() {

    if (turning) {

        return;

    }


    const next =
        nextCleaningDay(
            simulatedDate
        );


    const movement =
        rotationForCleaningDay(
            next
        );


    if (!movement) {

        return;

    }


    simulatedDate =
        next;


    /*
        Physically rotate
        the 3 × 3 layer.
    */

    await rotateLayer(

        movement.axis,

        movement.layer,

        movement.direction

    );


    /*
        Update assignments.
    */

    updateInformation(
        simulatedDate
    );


    statusElement.textContent =
        `Cube rotated → ${
            next.toLocaleDateString(
                "en-US",
                {
                    weekday:
                        "long",

                    month:
                        "long",

                    day:
                        "numeric"
                }
            )
        }`;

}


/* ============================================================
   AUTOMATIC DATE CHECK
============================================================ */

let lastDate =
    localStorage.getItem(
        "cleaningCubeLastDate"
    );


function checkDate() {

    const today =
        new Date();


    const todayKey =
        dateKey(today);


    /*
        First visit.
    */

    if (!lastDate) {

        lastDate =
            todayKey;


        localStorage.setItem(
            "cleaningCubeLastDate",
            todayKey
        );


        simulatedDate =
            today;


        updateInformation(
            today
        );


        return;

    }


    /*
        Nothing changed.
    */

    if (
        todayKey === lastDate
    ) {

        return;

    }


    const previous =
        parseDate(
            lastDate
        );


    let cursor =
        addDays(
            previous,
            1
        );


    const datesToRotate = [];


    /*
        Find cleaning days
        that were missed.
    */

    while (
        dateKey(cursor) !==
        todayKey
    ) {

        if (
            isCleaningDay(cursor)
        ) {

            datesToRotate.push(
                new Date(cursor)
            );

        }


        cursor =
            addDays(
                cursor,
                1
            );

    }


    /*
        Include today.
    */

    if (
        isCleaningDay(today)
    ) {

        datesToRotate.push(
            today
        );

    }


    lastDate =
        todayKey;


    localStorage.setItem(
        "cleaningCubeLastDate",
        todayKey
    );


    simulatedDate =
        today;


    /*
        Perform the rotations
        one after another.
    */

    (
        async () => {

            for (
                const cleaningDate
                of datesToRotate
            ) {

                const movement =
                    rotationForCleaningDay(
                        cleaningDate
                    );


                if (movement) {

                    await rotateLayer(

                        movement.axis,

                        movement.layer,

                        movement.direction

                    );

                }

            }


            updateInformation(
                today
            );

        }

    )();

}


/* ============================================================
   RESET
============================================================ */

resetButton.addEventListener(
    "click",
    () => {

        createCubies();


        simulatedDate =
            new Date();


        renderCube(
            simulatedDate
        );


        localStorage.removeItem(
            "cleaningCubeLastDate"
        );


        lastDate =
            null;


        checkDate();


        statusElement.textContent =
            "Cube reset.";

    }
);


/* ============================================================
   TEST / NEXT BUTTON
============================================================ */

nextButton.addEventListener(
    "click",
    nextCleaningDayAnimation
);


/* ============================================================
   START
============================================================ */

createCubies();


renderCube(
    simulatedDate
);


updateInformation(
    simulatedDate
);


/*
    Check the date every 30 seconds.

    Therefore, if the website remains
    open overnight, it can automatically
    detect the new cleaning day.
*/

setInterval(
    checkDate,
    30000
);