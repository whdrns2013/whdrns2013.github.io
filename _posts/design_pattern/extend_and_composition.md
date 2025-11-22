

✔ 전통적 방식(상속 기반)

클래스가 특정 알고리즘을 사용하려면,

상위 클래스(추상 클래스)에 기본 알고리즘을 두고

하위 클래스가 이를 재정의(override)하여 다른 알고리리즘을 구현합니다.

문제점:

하위 클래스 수가 늘어남

행동을 변경하려면 클래스 자체를 새로 만들어야 함

실행 중에 알고리즘을 바꿀 수 없음 (상속은 정적 구조라서)

✔ 전략 패턴 방식(합성 기반)

전략 패턴은 알고리즘을 Strategy 인터페이스로 추상화하고
구체 알고리즘은 Concrete Strategy 객체로 만들어 둡니다.

그리고 중요한 점:

➡️ 클래스는 알고리즘을 상속하지 않는다.
➡️ 필요한 알고리리즘 객체를 ‘합성(Composition)’을 통해 주입받는다.

즉, 객체 안에 전략을 “가지고”(has-a) 있는 구조로 바뀝니다.

이렇게 하면:

원하는 알고리즘 객체를 런타임에 교체 가능

클래스 계층이 불필요하게 늘어나지 않음

알고리즘 변경이 기존 코드를 거의 건드리지 않고 이루어짐

## 상속 기반 접근  

- 행동 변경은 오직 하위 클래스를 새로 만들어야 함  

```pseudo
// 상위 클래스
class Character {
    method attack() {
        // 기본 공격 행동 (혹은 추상 메서드)
    }
}

// 하위 클래스들: 공격 알고리즘을 재정의
class Warrior extends Character {
    method attack() {
        print("칼로 공격한다")
    }
}

class Archer extends Character {
    method attack() {
        print("활로 공격한다")
    }
}

// 사용
character = new Warrior()
character.attack()   // "칼로 공격한다"

```

## 합성 기반 접근  

- 행동을 외부 객체(전략)로 주입받아 결정  

```pseudo
// 전략 인터페이스
interface AttackStrategy {
    method attack()
}

// 전략 구현들(ConcreteStrategy)
class SwordAttack implements AttackStrategy {
    method attack() {
        print("칼로 공격한다")
    }
}

class BowAttack implements AttackStrategy {
    method attack() {
        print("활로 공격한다")
    }
}

// Context: 전략을 합성(composition)으로 보유
class Character {
    AttackStrategy strategy

    constructor(strategy) {
        this.strategy = strategy
    }

    method setStrategy(strategy) {
        this.strategy = strategy
    }

    method attack() {
        strategy.attack()
    }
}

// 사용
character = new Character(new SwordAttack())
character.attack()   // "칼로 공격한다"

// 런타임에 전략 변경 가능
character.setStrategy(new BowAttack())
character.attack()   // "활로 공격한다"
```