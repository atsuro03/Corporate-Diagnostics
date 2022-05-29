const questionDetails = {
    1: "週１日以上の休みがない",
    2: "残業代が出ない",
    3: "長時間労働",
    4: "パワハラやセクハラが日常茶飯事",
    5: "上司や社長が横暴",
    6: "精神論で無理を強いる",
    7: "給料が最低賃金を下回っている",
    8: "離職率が高すぎる"
} 

const config = {
    target: document.getElementById("target"),
    initialPage: document.getElementById("initial_page"),
    scorePage: document.getElementById("score"),
    count: 1
};

class Model {
    static generateIndexList() {
        let indexList = [];
        for(let i = 1; i < Object.keys(questionDetails).length; i++) {
            indexList.push(i);
        }
        return indexList;
    }

    static shuffleIndex(arr) {
        for(let i = 0; i < arr.length; i++) {
            let j = Math.floor(Math.random() * i) + 1;    
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr;
    }

    static deleteIndex(arr) {
        arr.shift();
    } 

    static setArray(arr, symbol) {
        if(arr.length === 5) return false;
        else {
            arr.push(symbol);
            return true;
        }
    }

    static resetIndexList(arr) {
        arr = [];
    }
}

class View {
    static generatePage() {
        config.initialPage.innerHTML = this.getTitleHtml();
        config.initialPage.innerHTML += `
            <h3 class="text-center pt-5 fs-4">あなたの会社はどうですか？</h3>
        `;
    
        let questionFrame = document.createElement("div");
        questionFrame.classList.add("text-center", "fs-5", "pt-4")
        questionFrame.innerHTML = `
            <button type="button" id="startBtn">診断開始</button>
            <h4 id="text" class="d-none"></h4>
        `;
        
        let answerArea = document.createElement("div");
        answerArea.classList.add("d-flex", "justify-content-center", "py-5");
        answerArea.innerHTML = `
            <button type="button" id="circle" class="answer border border-4 border-danger text-danger p-5 mx-5 bg-white d-none">〇</button>
            <button type="button" id="cross" class="answer border border-4 border-primary text-primary p-5 mx-5 bg-white d-none">✕</button>
        `;

        config.initialPage.append(questionFrame);
        config.initialPage.append(answerArea);
    
        //質問の表示領域を取得
        let text = document.getElementById("text");
        //questionDetailsからランダムに出力するためのインデックスを格納
        let indexList = Model.shuffleIndex(Model.generateIndexList());

        const startBtn = document.getElementById("startBtn");
        const circle = document.getElementById("circle");
        const cross = document.getElementById("cross");
        startBtn.addEventListener("click", function() {
            startBtn.classList.add("d-none");
            text.innerHTML = `Q.${config.count}　${questionDetails[indexList[0]]}`;
            Model.deleteIndex(indexList);
            text.classList.remove("d-none");
            circle.classList.remove("d-none");
            cross.classList.remove("d-none");
            config.count++;
        });
        
        circle.addEventListener("click", function() {
            text.innerHTML = `Q.${config.count}　${questionDetails[indexList[0]]}`;
            Model.deleteIndex(indexList);   
            Model.setArray(Score.array, "〇")
            config.count++;
            let point = Score.getSymbolCount(Score.array);

            if(Score.array.length === 5) {
                Score.resetScore();
                Model.resetIndexList(indexList);
                indexList = Model.shuffleIndex(Model.generateIndexList());
                View.scorePopup(point, startBtn, text, circle, cross);
            }
            
        });

        cross.addEventListener("click", function() {
            text.innerHTML = `Q.${config.count}　${questionDetails[indexList[0]]}`;
            Model.deleteIndex(indexList); 
            Model.setArray(Score.array, "✕");           
            config.count++;
            let point = Score.getSymbolCount(Score.array);

            if(Score.array.length === 5) {
                Score.resetScore();
                Model.resetIndexList(indexList);
                indexList = Model.shuffleIndex(Model.generateIndexList());
                View.scorePopup(point, startBtn, text, circle, cross);
            }
        });

        config.target.append(config.initialPage);
        
    }

    static getTitleHtml() {
        let string = `
            <div class="bg-secondary py-2">
                <h2 class="lh-base fs-3 fw-bold text-center text-light">Corporate Diagnostics</h2>
            </div>
        `;
        return string;
    }

    static scorePopup(point, startBtn, text, circle, cross) {
        config.scorePage.classList.remove("d-none");
        config.scorePage.classList.add("popup", "text-center");
        let container = document.createElement("div");
        container.classList.add("popup_inner", "shadow", "p-4", "mb-5", "bg-body", "rounded");
        container.innerHTML = `
            <h3 class="py-3">あなたの会社の点数は</h3>
        `;

        if(point >= 80) {
            container.innerHTML += `
                <h2>おめでとうございます🎉</h2>
                <h1 class="py-3">${point}点です！</h1>
                <p class="fs-3 py-3">ブラック企業に認定します。</p>
            `;
        } else if(40 <= point < 80) {
            container.innerHTML += `
                <h1 class="py-3">${point}点です。</h1>
                <h2 class="py-3">一般的です。</h2>
                <p class="fs-3 py-3">大体会社はこんなもん。</p>
            `;
        } else if(0 <= point < 40) {
            container.innerHTML += `
                <h1 class="py-3">${point}点です！</h1>
                <h2 class="py-3">とても良い会社です！</h2>
                <p class="fs-3 py-3">ホワイト企業に認定します。</p>
            `;
        }

        let restartBtn = document.createElement("button");
        restartBtn.innerHTML = "ホームに戻る"; 
        container.append(restartBtn);
        
        restartBtn.addEventListener("click", function() {
            View.changeStyle(startBtn, text, circle, cross);
            config.count = 1;
        });

        config.scorePage.append(container);

    }

    static changeStyle(startBtn, text, circle, cross) {
        startBtn.classList.remove("d-none");
        text.classList.add("d-none");
        circle.classList.add("d-none");
        cross.classList.add("d-none");
        config.scorePage.classList.add("d-none");
    }
}

class Controller {
    static start() {
        View.generatePage();
    }

}

class Score {
    static array = [];

    static getSymbolCount(arr) {
        let circle = 0;
        let cross = 0;
        for(let i = 0; i < arr.length; i++) {
            if(arr[i] === "〇") circle++;
            else if(arr[i] === "✕") cross++;
        }

        return this.getScore(circle, cross);
    }

    static getScore(circle, cross) {
        let circlePoint = circle * 20;
    
        for(let i = cross; i === 0; i--) {
            circlePoint - 20;
        }

        if(circlePoint <= 0) return 0;
        else return circlePoint;
    }

    static resetScore() {
        this.array = [];
    }
}

Controller.start();