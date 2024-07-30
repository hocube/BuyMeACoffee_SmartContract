pragma solidity ^0.8.9;
contract BuyMeACoffee {
    // 누군가 커피를 구매할 때마다 발생
    event NewCoffee(address indexed _sender, string name, string _message, uint256 _timestamp);

    // 컨트랙트의 소유자의 주소를 저장. 이 주소는 컨트랙트를 배포한 사람의 주소
    address payable owner;

    // 컨트랙트가 배포될 때 한 번 실행. 배포한 사람을 소유자로 설정.
    constructor() {
        owner = payable(msg.sender);
    }

    // 커피 구매 정보를 저장하기 위한 구조체
    struct BuyCoffee {
        address sender;
        string name;
        uint timestamp;
        string message;
    }

    // 각 커피 구매 건을 고유 ID와 매핑
    mapping (uint => BuyCoffee) idToBuyCoffee;

    // 커피 ID - 각 커피 구매 건에 고유한 ID를 부여하기 위한 변수
    uint public coffeeId;

    // 커피 구매 함수 (커피를 구매할 때 호출)
    // 구매자는 이름과 메시지를 입력하고, 일정 금액 이상을 전송
    function buyCoffee(string memory name, string memory message) public payable {
        // 전송된 KLAY 금액이 0보다 큰지 확인
        require(msg.value > 0, "Tip must be greater than zero");
        coffeeId++;
	
        BuyCoffee storage coffee = idToBuyCoffee[coffeeId];
        coffee.message = message;
        coffee.name = name;
        coffee.sender = msg.sender;
        coffee.timestamp = block.timestamp;

        // 기부자의 정보를 가지고 NewCoffee 이벤트를 발생시켜 새로운 커피 구매를 알린다.
        emit NewCoffee(msg.sender, name, message, block.timestamp);
    }

    // 기부금 인출 함수 (이 함수는 컨트랙트 소유자만 호출할 수 있다)
    // 소유자는 컨트랙트에 쌓인 기부금을 인출할 수 있다.
    function withdrawCoffeTips() public {
        require(owner == msg.sender, "Not owner");
        require(owner.send(address(this).balance) );
    }

    // 모든 커피 기록 가져오기 함수
    // 이 함수는 특정 ID까지의 모든 커피 구매 기록을 가져온다.
    // ID가 존재하지 않으면 오류를 반환
    // 새로운 배열을 생성하고, 해당 배열에 구매 기록을 저장하여 반환
    function getAllCoffee(uint _id) public view returns(BuyCoffee[] memory c){
        require(_id <= coffeeId, "Non-existent id");
        c = new BuyCoffee[](_id);
        for(uint i = 0; i < _id; i++) {
            c[i] = idToBuyCoffee[i + 1];
        }
    }
}
