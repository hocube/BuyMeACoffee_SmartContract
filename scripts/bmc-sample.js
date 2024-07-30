const hre = require("hardhat");

// 특정 주소의 KLAY 잔액을 가져와 로그에 출력
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// 여러 주소의 KLAY 잔액을 가져와 각각 로그에 출력
async function getBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`address ${idx} balances`, await getBalance(address));
    idx++;
  }
}

// 모든 커피 구매 기록을 가져와 로그에 출력
async function getAllCoffee(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const sender = memo.sender;
    const name = memo.name;
    const message = memo.message;
    console.log(`At ${timestamp}, ${name}, with ${sender}, said: "${message}"`);
  }
}

// main function: 스마트컨트랙트를 테스트하는 함수
async function main() {
  // 계정 목록(소유자, 팁을 보내는 사람 3명) 설정
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // 컨트랙트(BuyMeACoffee.sol) 인스턴스 생성 및 배포
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffe = await BuyMeACoffee.deploy();
  await buyMeACoffe.deployed();
  console.log(`BuyMeACoffee Contract Address`, buyMeACoffe.address);

  // 수취인 목록을 설정하고 getBalances 함수를 호출하여 잔액을 확인
  const addressses = [owner.address, tipper1.address, buyMeACoffe.address];
  console.log("======GET BALANCE=======");
  await getBalances(addressses);

  // 3개의 다른 인스턴스에서 buyCoffee 함수를 호출하여 팁을 보내고, 커피 거래 후 getBalances 함수를 호출하여 잔액을 확인
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffe.connect(tipper1).buyCoffee("Alice", "Hi Jude", tip);
  await buyMeACoffe.connect(tipper2).buyCoffee("Bob", "Hi Alice", tip);
  await buyMeACoffe.connect(tipper3).buyCoffee("Japhet", "Hi Ox", tip);
  console.log("======GET BALANCE AFTER TIPPING=======");
  await getBalances(addressses);

  // withdraw 함수를 호출하여 모든 자금을 소유자 주소로 출금하고, getBalances 함수를 호출하여 잔액을 확인
  await buyMeACoffe.connect(owner).withdrawCoffeTips();
  console.log("======GET BALANCE AFTER WITHDRAWING TIP=======");
  await getBalances(addressses);

  // getAllCoffee 함수를 호출하여 스마트 컨트랙트의 모든 커피 트랜잭션을 확인
  const coffeeId = await buyMeACoffe.coffeeId();
  const id = coffeeId.toString();
  console.log(coffeeId.toString());
  const allCoffee = await buyMeACoffe.getAllCoffee(id);

  await getAllCoffee(allCoffee);
}
// 스크립트 실행
// 에러가 발생하면 로그에 출력하고 프로세스 종료 코드를 설정
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
