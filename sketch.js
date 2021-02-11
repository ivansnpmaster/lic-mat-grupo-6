let r = 90, h = 160, n = 3, d = 1

let rSlider, hSlider, nSlider, dSlider
let rText, hText, nText, dText

let vOText, vEText

let lastR, lastH, lastN, lastD

function setup()
{
    let canvas = createCanvas(400, 400, WEBGL)
    canvas.parent("canvasHolder")

    background(240)

    rText = createElement("span", r)
    rText.parent("rN")
    rSlider = createSlider(50, 200, r, 10)
    rSlider.parent("rS")

    hText = createElement("span", h)
    hText.parent("hN")
    hSlider = createSlider(10, 300, h, 10)
    hSlider.parent("hS")

    nText = createElement("span", n)
    nText.parent("nN")
    nSlider = createSlider(3, 12, n, 1)
    nSlider.parent("nS")

    dText = createElement("span", d)
    dText.parent("dN")
    dSlider = createSlider(1, 60, d, 1)
    dSlider.parent("dS")

    vOText = createElement("p", 0)
    vOText.parent("vO")

    vEText = createElement("p", 0)
    vEText.parent("vE")

    rectMode(CORNERS)
    angleMode(RADIANS)
}

function draw()
{
    r = rSlider.value()
    n = nSlider.value()
    h = hSlider.value()
    d = dSlider.value()

    if (lastR !== r || lastH !== h || lastN !== n || lastD !== d)
    {
        background(240)
        drawAgain()

        lastR = r
        lastH = h
        lastN = n
        lastD = d
    }
}

function calcArea(p)
{
    let area = 0

    for (let i = 0, t = p.length; i < t; i++)
    {
        const pontoA = p[i].copy()
        const pontoB = p[(i + 1) % t].copy()

        const ab = p5.Vector.sub(pontoB, pontoA)
        const mAB = ab.mag()
        let vAB2 = ab.setMag(mAB / 2)
        vAB2 = p5.Vector.add(vAB2, pontoA)
        const newC = createVector(0, 0, pontoA.z)
        const newH = p5.Vector.sub(newC, vAB2).mag()

        area += (mAB * newH) / 2
    }

    return area
}

function drawAgain()
{
    rText.html(r)
    hText.html(h)
    nText.html(n)
    dText.html(d)

    const c = createVector(0, 0, h)

    translate(0, 100, -200)
    rotateX(PI / 4)

    // CÁLCULO DOS PONTOS NO ESPAÇO

    const aInc = TWO_PI / n
    const points = []
    const subHei = h / d

    for (let y = 0; y < d; y++)
    {
        const lPoints = []

        if (y == 0)
            for (let i = 0; i < n; i++)
            {
                const x = r * cos(aInc * i), y = r * sin(aInc * i), z = 0
                const p = createVector(x, y, z)
                lPoints.push(p)
            }
        else
            for (let t = 0, lP = points[0]; t < n; t++)
            {
                const a = lP[t].copy()
                let ac = p5.Vector.sub(c.copy(), a)
                ac.setMag((ac.mag() * y) / d).add(a)

                lPoints.push(ac)
            }

        points.push(lPoints)
    }

    // CÁLCULO DA ÁREA PRINCIPAL

    let area = calcArea(points[0])

    const mainVol = (area * h) / 3
    vOText.html(mainVol.toFixed(2) + " uv")

    noFill()

    // CÁLCULO DA ÁREA ESTIMADA

    let volEst = 0

    for (let i = 0; i < d; i++)
    {
        const area = calcArea(points[i])
        volEst += area * subHei

        for (let j = 0, t = points[i]; j < t.length; j++)
        {
            const a = t[j].copy()
            const newA = a.copy()
            newA.z += subHei

            const b = t[(j + 1) % t.length].copy()
            const newB = b.copy()
            newB.z += subHei

            beginShape()

            vertex(a.x, a.y, a.z)
            vertex(b.x, b.y, b.z)
            vertex(newB.x, newB.y, newB.z)
            vertex(newA.x, newA.y, newA.z)

            endShape(CLOSE)
        }
    }

    vEText.html(volEst.toFixed(2) + " uv")

    // EXIBIÇÃO

    for (let i = 0; i < points[0].length; i++)
    {
        const a = points[0][i]
        line(a.x, a.y, a.z, c.x, c.y, c.z)
    }

    fill(0, 40)

    for (let p of points)
    {
        beginShape()

        for (let pt of p)
            vertex(pt.x, pt.y, pt.z)

        endShape(CLOSE)
    }
}