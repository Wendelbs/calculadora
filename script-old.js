const tela = document.getElementById("displayInput"); 
const telaResult = document.getElementById("displayResult"); 
telaResult.innerHTML = "0"; 
tela.innerHTML = "0"; 
memroyCalc = [0,0,""] 
calcSins = ['+','-','','/','^'] 
buttonEvent = document.getElementsByClassName('buttonD') for (let i = 0; i < buttonEvent.length; i++) { 
    buttonEvent[i].addEventListener('click', function() 
    { // Captura o valor do botão clicado 
    const numberButton = this.innerHTML; 
    const lastChar = tela.innerHTML.slice(-1); // Verificar se é um número 
    function isNumberTest(numTeste) { return !isNaN(numTeste); 
        
    } function cleanTela(fromTela) { fromTela.innerHTML = ""; } // Verificar se é um operador function testCalcSins(testCalc) { return calcSins.includes(testCalc); } resultSins = testCalcSins(numberButton) function functionMath(){ } function addNumber(){ if (memroyCalc[0]==0) { if (tela.innerHTML === "0") { telaResult.innerHTML = numberButton ; tela.innerHTML = numberButton; } else { telaResult.innerHTML += numberButton ; tela.innerHTML += numberButton; } } else if (memroyCalc[0]!==0 && telaResult.innerHTML.length === 1) { telaResult.innerHTML = numberButton; } else if (memroyCalc[0]!==0 && memroyCalc[1]==0 ) { telaResult.innerHTML += numberButton; } } function addZero(){ if (tela.innerHTML !="0") { telaResult.innerHTML += numberButton ; tela.innerHTML += numberButton; } else { telaResult.innerHTML = numberButton ; tela.innerHTML = numberButton; } } function addOperator(operator){ if (testCalcSins(lastChar)) { telaResult.innerHTML += ""; } else { telaResult.innerHTML += operator ; tela.innerHTML += operator; if (memroyCalc[0]!==0 && memroyCalc[1]!==0) { } } console.log(memroyCalc); } /function calcNumber(){ } / switch(numberButton) { case '0': addZero(); default: switch(numberButton) { case 'C': tela.innerHTML = 0; telaResult.innerHTML = 0; memroyCalc = [0,0,""] break; case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": addNumber(); break; case "+": addOperator("+"); break case "-": addOperator("-"); break; case "": addOperator("*"); break; case "/": addOperator("/"); break; } } }); }