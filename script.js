// to access custom attribute of element use brackets [].
// querySelector("[custom_attribute_name]")
const inputSlider = document.querySelector("[lengthSlider]");
const lengthDisplay = document.querySelector("[lengthNumber]");
const passwordDisplay = document.querySelector("[passwordDisplay]");
const coptBtn = document.querySelector("[dataCopy]");
const copyMsg = document.querySelector("[copyMsg]");

// accessing checkbox
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

// 
const indicator = document.querySelector(".showStrength");
const generateButton = document.querySelector(".generateBtn");

// for all checkbox
const allCheckBox = document.querySelectorAll("input [type=checkbox]");


// password in starting - empty
let password = "";
// password Length in starting 
let passwordLength = 10;
// only 1 checkbox is checked in starting 
let checkCount = 1;
// set strength circle color to grey in starting 

sliderHandle();

// set strength color to grey intially
setIndicator("#ccc");

// function to handle the slider -> it reflects the password length on UI
function sliderHandle() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // to fill the color when slider move
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// function to set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 13px 0px ${color}`;
}

// function for random number -> find number b/w min & max
function getRandomInteger(min, max) {
    return Math.floor(Math.random() *(max - min)) + min;
}
function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateUpperCase() {
    // String.fromCharCode() method will convert ASCII value to character. 65 -> A , 91-> Z
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowerCase() {
    // String.fromCharCode() method will convert ASCII value to character. 97 -> a , 123-> z
    return String.fromCharCode(getRandomInteger(97, 123));
}

// string for all symbols. We can also make a list to store all symbols
// charAt() method returns a character at that index which is inside charAt method.
const symbols = '~`!@#$%^&*()_-+={[}]:;"<,>.?/';
function generateSymbol() {
    const randomNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

// function to calculate the strength of password & displays the color of circle for strength
function calculateStrength() {
    // set all checkbox false in starting
    let upperCheckbox = false;
    let lowerCheckbox = false;
    let numCheckbox = false;
    let symbolCheckbox = false;

    // .checked property to check either check box is checked or not. If checkbox is checked then it will return ture.
    if(uppercaseCheck.checked) {
        upperCheckbox = true;
    }
    if(lowercaseCheck.checked) {
        lowerCheckbox = true;
    }
    if(numbersCheck.checked) {
        numCheckbox = true;
    }
    if(symbolsCheck.checked) {
        symbolCheckbox = true;
    }

    if(upperCheckbox && lowerCheckbox && (numCheckbox || symbolCheckbox) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((upperCheckbox || lowerCheckbox) && (numCheckbox || symbolCheckbox) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// function to copy password -> 
// await navigator.clipboard.writeText(passwordDisplay.value); this line returns the promise.
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to visible span of copied
    copyMsg.classList.add("active");

    // to remove span of copied after 2sec
    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// add event listener to handle slider -> change the slider value & show that value in password length
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    sliderHandle();
})

// add event lister on copy button to copy the password if content is present
coptBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})


// add event listener on generate password btn

// count from starting at every time when any checkbox is ticked
function handleCheckBoxChange() {
    checkCount =0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // when pass len is less than no. of checked of checkbox then pass len is equal to check count
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        sliderHandle();
    }
}
// add event listener on check boxes to count how many check box is checked so that includinh that values it will generate the password.
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// shuffle the values of password
function shufflePassword(array) {
    // using Fisher yates method on array
    for(let i=array.length-1; i>0; i--){
        // find random j index
        const j = Math.floor(Math.random() * (i+1));
        // swap value of j with ith value 
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));

    return str;
}

// for generate password btn
generateButton.addEventListener('click', () => {
    // when no one checkbox is ticked
    if(checkCount == 0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        sliderHandle();
    }

    // find new password, and remove old generated password
    // remove old generated password
    password = "";

    // create array which contains all functions to generate random values for password
    let funcArray = [];

    if(uppercaseCheck.checked){
        funcArray.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArray.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArray.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArray.push(generateSymbol);
    }

    // compulsory [checked box values] addition of values
    for(let i=0; i<funcArray.length; i++){
        password += funcArray[i]();
    }

    // remaining addition of values to comlete the length of password
    for(let i=0; i<passwordLength - funcArray.length; i++){
        let randomIndex = getRandomInteger(0, funcArray.length);
        password += funcArray[randomIndex]();
    }

    // shuffle the values 
    password = shufflePassword(Array.from(password)); 

    // show pass in input
    passwordDisplay.value = password;

    // calculate strength
    calculateStrength();
})