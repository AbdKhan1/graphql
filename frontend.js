export class queryData {
    constructor(objArray) {
        this.dataArray = objArray
    }
    displaySkills(totalSkill, section) {
        const getPercentageValue = (amount, object) => Math.round(((amount / object.total) + Number.EPSILON) * 100);
        const randomColour = () => `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;

        const nsURI = "http://www.w3.org/2000/svg"
        const skillsContainer = document.createElement('div')
        skillsContainer.classList.add('skills-container')

        const ChartContainer = document.createElement('div')
        ChartContainer.classList.add('svg-chart')
        skillsContainer.appendChild(ChartContainer)

        const pieChartContainer = document.createElement('div')
        pieChartContainer.classList.add('svg-pie-chart')
        ChartContainer.appendChild(pieChartContainer)

        const colorContainer = document.createElement('div')
        colorContainer.classList.add('svg-pie-chart-color')

        const pieChart = document.createElementNS(nsURI, 'svg')
        pieChart.setAttributeNS(null, "viewBox", "-8 15 20 20")
        pieChartContainer.appendChild(pieChart)


        const r = 2
        const circum = Math.round((Math.PI * r + Number.EPSILON) * 100) / 100

        let counter = 0
        let offset = [0]
        let pieEle = []
        for (let key in totalSkill) {
            if (key != 'total') {
                console.log(key)
                let percent = getPercentageValue(totalSkill[key], totalSkill)
                const fraction = document.createElementNS(nsURI, 'circle')
                const color = "white";
                fraction.setAttributeNS(null, "class", `${key}`)
                fraction.setAttributeNS(null, "r", r / 2)
                fraction.setAttributeNS(null, "cx", r)
                fraction.setAttributeNS(null, "cy", r)
                fraction.setAttributeNS(null, "fill", "transparent")
                fraction.setAttributeNS(null, "stroke", `${color}`)
                fraction.setAttributeNS(null, "stroke-width", r)
                fraction.setAttributeNS(null, "stroke-dasharray", (percent * circum) / 100 + circum)
                fraction.setAttributeNS(null, "stroke-dashoffset", -offset[counter])
                fraction.setAttributeNS(null, "transform", "rotate(-90) translate(-20)")
                fraction.setAttributeNS(null, 'style', 'transition: 0.5s all;');
                offset.push(offset[counter] + ((percent * circum) / 100))
                pieEle.push(fraction)
                pieChart.appendChild(fraction)
                const skillColor = document.createElement('p')
                skillColor.setAttribute('id', (`${key}` + `${counter}`))
                skillColor.innerHTML = `${key}`.replace("skill_", "")
                skillColor.style.color = "white";
                colorContainer.appendChild(skillColor)
                counter++
            }
        }
        section.appendChild(skillsContainer)
        section.appendChild(colorContainer)
        section.insertBefore(colorContainer, skillsContainer)
        let fr = []
        for (let i = 0; i < pieEle.length; i++) {
            let skillColor = document.getElementById(`${pieEle[i].classList[0]}` + `${i}`)
            let obj = {
                ele: pieEle[i],
                counter: 0,
            }
            fr.push(obj)
            skillColor.addEventListener('mouseenter', setColor(obj))
            skillColor.addEventListener('mouseleave', removeColor(obj))
        }

        function setColor(obj) {
            return function () {
                this.style.textShadow = "1px 1px 1px #fff, 1px 1px 1px #ccc"
                obj.ele.setAttributeNS(null, "stroke", "yellow")
                let index = fr.indexOf(obj)
                if (fr[index].counter === 2) {
                    fr[index].counter = 0
                    fr[index].ele.setAttributeNS(null, "stroke", "white")
                }
            }
        }
        function removeColor(obj) {
            return function () {
                this.style.textShadow = "none"
                let index = fr.indexOf(obj)
                fr[index].counter++
            }
        }
    }
    displayXp(section) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const svgContainer = document.createElement('div')
        svgContainer.setAttribute('id', 'xp-container')
        svg.setAttribute('height', `${500}px`)
        svg.setAttribute('width', `${450}px`)
        svg.setAttribute('viewBox', `0 350 500 500`)

        function generateChart(data) {
            const barChartElems = [];
            data = data.slice(0, data.length - 1)
            data.forEach((entry, index) => {
                let xp = Math.round(parseFloat(entry["xp"], 10) / 1000)
                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', index * (600 / data.length));
                bar.setAttribute('y', 500 - `${xp}`);
                bar.setAttribute('height', `${xp}px`);
                bar.setAttribute('width', `${(500 / data.length)}px`);
                bar.setAttribute('style', 'transition: 0.5s all;');
                bar.setAttribute('class', 'bar')
                bar.addEventListener('mouseover', mouseOverEffect)
                bar.addEventListener('mouseout', mouseOutEffect)
                bar.innerText = `${entry["projectName"]}` + ` ` + `${xp}` + `xp`
                svg.appendChild(bar);
                barChartElems.push(bar);
            });
            svgContainer.appendChild(svg)
            const projDetails = document.createElement('p')
            function mouseOverEffect() {
                this.classList.add("bar-highlight");
                projDetails.classList.add("bar-text")
                projDetails.innerText = this.innerText
                svgContainer.appendChild(projDetails)
            }
            function mouseOutEffect() {
                this.classList.remove("bar-highlight");
            }

        }
        generateChart(this.dataArray);
        section.appendChild(svgContainer)
    }
    displayGrades(gradesObj, section) {
        const projectDiv = document.createElement('div')
        for (let k = this.dataArray.length - 2; k >= 0; k--) {
            let project = gradesObj["project-grades"][k]
            let createdAt = project["created"].slice(0, 10)
            let updatedAt = project["updated"].slice(0, 10)
            let grade = Math.round(parseFloat(project["grade"], 10) * 100) / 100
            const projectDetails = `<h3>` + `${project["projectName"]}` + `</h3>`
                + `<p>Grade:` + `${grade}` + `</p>`
                + `<p>Created At:` + `${createdAt}` + `</p>`
                + `<p>Updated At:` + `${updatedAt}`
                + `<br>`
            projectDiv.innerHTML += projectDetails
            section.appendChild(projectDiv)
        }
    }
    displayProfile(section) {
        const name = document.createElement('div')
        const id = document.createElement('div')
        const level = document.createElement('div')
        const lastProj = document.createElement('div')
        name.classList.add('profile-text')
        id.classList.add('profile-text')
        level.classList.add('profile-text')
        lastProj.classList.add('profile-text')
        var lastProjDetails = `<h3>Last activity:</h3>` + `<p>` + `${this.dataArray[0]["projectName"]}` + `</p>`
        name.innerHTML = `<h3>Username:</h3>` + `<p>gymlad</p>`
        id.innerHTML = `<h3>Id:</h3>` + `<p>559</p>`
        level.innerHTML = `<h3>Current level:</h3>` + `${this.dataArray[(this.dataArray.length) - 1]["amount"]}`
        lastProj.innerHTML = lastProjDetails
        section.append(name, id, lastProj, level)
    }
}

export function createLoader(action) {
    if (action == true) {
        const loaderContainer = document.createElement('div')
        loaderContainer.classList.add('loader-container')

        const loader = document.createElement('div')
        loader.classList.add('loader')
        loaderContainer.appendChild(loader)

        const loaderTop = document.createElement('div')
        loaderTop.classList.add('loader-top')
        loader.appendChild(loaderTop)

        const loaderInnerOval = document.createElement('div')
        loaderInnerOval.classList.add('loader-inner-oval')
        loader.appendChild(loaderInnerOval)

        const loaderCircle1 = document.createElement('div')
        loaderCircle1.classList.add('loader-circle1')
        loaderInnerOval.appendChild(loaderCircle1)

        const loaderCircle2 = document.createElement('div')
        loaderCircle2.classList.add('loader-circle2')
        loaderInnerOval.appendChild(loaderCircle2)

        const loaderCircle3 = document.createElement('div')
        loaderCircle3.classList.add('loader-circle3')
        loaderInnerOval.appendChild(loaderCircle3)

        document.body.appendChild(loaderContainer)
    } else {
        document.querySelector('.loader-container').remove()
        document.querySelector('body').style.display = "block"
        document.querySelector('body').style.height = "100%"
    }
}