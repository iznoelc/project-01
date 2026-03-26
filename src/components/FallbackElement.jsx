import "../styles/loader.css";

export default function FallbackElement(){
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-1 pt-16">
                <h1 className="primary-font text-5xl">Please wait...</h1>
                {/* <div className="scale-25 origin-top-left relative w-[349px] h-[344px]"> scaled via the original gleebus art */}
                <div class="flower">
                    <div class="petal petal1"></div>
                    <div class="petal petal2"></div>
                    <div class="petal petal3"></div>
                    <div class="petal petal4"></div>
                    <div class="petal petal5"></div>
                    <div class="petal petal6"></div>
                    <div class="petal petal7"></div>
                    <div class="petal petal8"></div>
                    <div class="center"></div>
                </div>
            </div>
        </>
    );
}