function reverseString(str) {
    let s = str.split('-');
    // let a = [];
    // for ( let i = s.length - 1; i >= 0; i -- ) {
    //     a.push(s[i]);
    // }
    return s.reverse().join('&');
}

// reverseString('abcde-22');
// console.log(reverseString('abcde-22'))

String.prototype.killPoint = function () {
    return this.replace(/^\./g,'')
}

function upperCase(str) {
    let words = str.split(' ');
    for ( let i =0; i< words.length; i ++ ) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return words;

}

// console.log(upperCase('zhang wei gab ng'))
for (i=0,j=0;i<6,j<10;i++,j++) {
    console.log('i=',i)
    console.log('j=',j)
    var k =i+j;
}
console.log(k)