## 1 What is the difference between null and undefined?
* undefined: যখন কোনো ভ্যারিয়েবল ডিক্লেয়ার করা হয় কিন্তু কোনো ভ্যালু অ্যাসাইন করা হয় না ।
- let x;
console.log(x); // undefined

* null: এটি একটি ইচ্ছাকৃতভাবে সেট করা মান, যা বোঝায় “কোনো মান নেই”।
- let y = null;
console.log(y); // null

## 2. What is the use of the map() function in JavaScript? How is it different from forEach()?
* map(): একটি অ্যারের প্রতিটি উপাদানের উপর কাজ করে এবং একটি নতুন অ্যারে রিটার্ন করে।
- const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6]

* forEach(): অ্যারের প্রতিটি উপাদানের উপর কাজ করে কিন্তু কিছু রিটার্ন করে না।

const numbers = [1, 2, 3];
numbers.forEach(num => console.log(num * 2));

## 3 What is the difference between == and ===?
* == (Loose Equality): শুধু মান (value) তুলনা করে, টাইপ কনভার্সন করতে পারে।
-console.log(5 == "5"); // true

* === (Strict Equality): মান এবং টাইপ দুটোই তুলনা করে।
- console.log(5 === "5"); // false

## 4.What is the significance of async/await in fetching API data?
async/await ব্যবহার করা হয় অ্যাসিনক্রোনাস (asynchronous) কোড সহজভাবে লেখার জন্য।

* এটি Promise-ভিত্তিক কাজকে সহজ এবং পড়তে সুবিধাজনক করে তোলে।
* কোডকে synchronous-এর মতো দেখায় কিন্তু non-blocking থাকে।
* Error হ্যান্ডলিং সহজ হয় try...catch দিয়ে।

## 5. Explain the concept of Scope in JavaScript (Global, Function, Block).
- Scope হলো কোনো ভ্যারিয়েবল কোথায় অ্যাক্সেসযোগ্য তা নির্ধারণ করার নিয়ম।
* Global Scope: যেসব ভ্যারিয়েবল ফাংশনের বাইরে ডিক্লেয়ার করা হয়।
let a = 10;
function test() {
  console.log(a); // Global variable
}

* Function Scope: ফাংশনের ভিতরে ডিক্লেয়ার করা ভ্যারিয়েবল শুধুমাত্র সেই ফাংশনের ভিতরেই ব্যবহার করা যায়।
function test() {
  let b = 20;
  console.log(b);
}
console.log(b); // Error

* Block Scope: {} এর ভিতরে ডিক্লেয়ার করা let এবং const ভ্যারিয়েবল শুধুমাত্র সেই ব্লকের ভিতরে অ্যাক্সেসযোগ্য।
if (true) {
  let c = 30;
  console.log(c);
}
console.log(c); // Error