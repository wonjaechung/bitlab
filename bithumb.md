일(Day) 캔들
get
https://api.bithumb.com/v1/candles/days

예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.


Request Parameters
필드

설명

타입

market

마켓 코드 (ex. KRW-BTC)

String

to

마지막 캔들 시각 (exclusive)

ISO8061 포맷 (yyyy-MM-dd HH:mm:ss or yyyy-MM-ddTHH:mm:ss)
기준 시간 KST
비워서 요청시 가장 최근 캔들로 반환됨
String

count

캔들 개수(최대 200개까지 요청 가능), 기본값 1

Integer

convertingPriceUnit

종가 환산 화폐 단위 (생략할 수 있으며 KRW로 입력한 경우 원화 환산 가격으로 반환됨)

String

Response
필드

설명

타입

market

마켓명

String

candle_date_time_utc

캔들 기준 시각(UTC 기준) 포맷: yyyy-MM-dd'T'HH:mm:ss

String

candle_date_time_kst

캔들 기준 시각(KST 기준) 포맷: yyyy-MM-dd'T'HH:mm:ss

String

opening_price

시가

Double

high_price

고가

Double

low_price

저가

Double

trade_price

종가

Double

timestamp

캔들 종료 시각(KST 기준)

Long

candle_acc_trade_price

누적 거래 금액

Double

candle_acc_trade_volume

누적 거래량

Double

prev_closing_price

전일 종가(UTC 0시 기준)

Double

change_price

전일 종가 대비 변화 금액

Double

change_rate

전일 종가 대비 변화량

Double

converted_trade_price

종가 환산 화폐 단위로 환산된 가격 (요청에 convertingPriceUnit 파라미터가 없는 경우 해당 필드는 반환되지 않음)

Double

convertingPriceUnit 파라미터의 경우, 원화 마켓이 아닌 다른 마켓(ex. BTC)의 일봉 요청시 종가를 명시된 파라미터 값으로 환산해 converted_trade_price 필드에 추가하여 반환합니다.

현재는 원화(KRW) 로 변환하는 기능만 제공하며 추후 기능을 확장할 수 있습니다.

Query Params
market
string
required
마켓 코드 (ex. KRW-BTC)

to
string
마지막 캔들 시각 (exclusive). 비워서 요청시 가장 최근 캔들

count
int32
Defaults to 1
캔들 개수(최대 200개까지 요청 가능)

convertingPriceUnit
string
종가 환산 화폐 단위 (생략 가능, KRW로 명시할 시 원화 환산 가격을 반환.)


주(Week) 캔들
get
https://api.bithumb.com/v1/candles/weeks

예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.


Request Parameters
필드

설명

타입

market

마켓 코드 (ex. KRW-BTC)

String

to

마지막 캔들 시각 (exclusive).
ISO8061 포맷 (yyyy-MM-dd HH:mm:ss or yyyy-MM-ddTHH:mm:ss). 기본적으로 KST 기준 시간이며 비워서 요청시 가장 최근 캔들

String

count

캔들 개수(최대 200개까지 요청 가능), 기본값 1

Integer

Response
필드

설명

타입

market

마켓명

String

candle_date_time_utc

캔들 기준 시각(UTC 기준)
포맷: yyyy-MM-dd'T'HH:mm:ss

String

candle_date_time_kst

캔들 기준 시각(KST 기준)
포맷: yyyy-MM-dd'T'HH:mm:ss

String

opening_price

시가

Double

high_price

고가

Double

low_price

저가

Double

trade_price

종가

Double

timestamp

캔들 종료 시각(KST 기준)

Long

candle_acc_trade_price

누적 거래 금액

Double

candle_acc_trade_volume

누적 거래량

Double

first_day_of_period

캔들 기간의 가장 첫 날

String

Query Params
market
string
required
마켓 코드 (ex. KRW-BTC)

to
string
마지막 캔들 시각 (exclusive). 비워서 요청시 가장 최근 캔들

count
int32
Defaults to 1
캔들 개수(최대 200개까지 요청 가능)



월(Month) 캔들
get
https://api.bithumb.com/v1/candles/months

예시코드는 JavaScript, Python, JAVA에 한해서만 제공합니다.


Request Parameters
필드

설명

타입

market

마켓 코드 (ex. KRW-BTC)

String

to

마지막 캔들 시각 (exclusive).
ISO8061 포맷 (yyyy-MM-dd HH:mm:ss or yyyy-MM-ddTHH:mm:ss). 기본적으로 KST 기준 시간이며 비워서 요청시 가장 최근 캔들

String

count

캔들 개수(최대 200개까지 요청 가능), 기본값 1

Integer

Response
필드

설명

타입

market

마켓명

String

candle_date_time_utc

캔들 기준 시각(UTC 기준)
포맷: yyyy-MM-dd'T'HH:mm:ss

String

candle_date_time_kst

캔들 기준 시각(KST 기준)
포맷: yyyy-MM-dd'T'HH:mm:ss

String

opening_price

시가

Double

high_price

고가

Double

low_price

저가

Double

trade_price

종가

Double

timestamp

캔들 종료 시각(KST 기준)

Long

candle_acc_trade_price

누적 거래 금액

Double

candle_acc_trade_volume

누적 거래량

Double

first_day_of_period

캔들 기간의 가장 첫 날

String

Query Params
market
string
required
마켓 코드 (ex. KRW-BTC)

to
string
마지막 캔들 시각 (exclusive). 비워서 요청시 가장 최근 캔들

count
int32
Defaults to 1
캔들 개수(최대 200개까지 요청 가능)