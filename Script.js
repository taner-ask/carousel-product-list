(() => {
    const init = () => {
      buildHTML();
      buildCSS();
      fetchProducts();
    };
    
    const buildHTML = () => {
        const productDetail = document.createElement("div");
        productDetail.className = "product-detail";
        document.body.appendChild(productDetail);

        const carouselTitle = document.createElement("h3");
        carouselTitle.className = "carousel-title";
        carouselTitle.textContent = "You Might Also Like";
        productDetail.appendChild(carouselTitle);
       
        const container = document.createElement("div");
        container.className = "carousel-container";

        const leftButton = document.createElement("button");
        leftButton.className = "arrow";
        leftButton.textContent = "<";
        container.appendChild(leftButton);

        const productList = document.createElement("div");
        productList.className = "product-list";
        container.appendChild(productList)

        const rightButton = document.createElement("button");
        rightButton.className = "arrow";
        rightButton.textContent = ">";
        container.appendChild(rightButton);
        

        document.querySelector(".product-detail").appendChild(container);
    };
   
    const buildCSS = () => {
      const css = `
          * {
            box-sizing: border-box;
            font-family: system-ui;
            scroll-behavior: smooth;
          }
            .carousel-title {
              font-size: 24px;
              margin-left: 210px;  
          }
          .carousel-container {
              display: flex;
              align-items: center;
              overflow: hidden;
              width: 100%;
              max-width: 1240px;
              margin:0 auto;
          }
          .product-list{
              display: flex;
              overflow: hidden; 
              scroll-behavior: smooth; 
              padding: 10px;
          }
          .product{
              min-width: 150px; 
              margin: 10px;
              cursor: pointer;
              position: relative;
              display:flex;
              flex-direction:column;
              gap:10px;
          }
          .heart {
              position: absolute;
              top: 5px;
              right: 5px;
              cursor: pointer;
              font-size: 20px;
          }
          .arrow {
              background: none;
              border: none;
              font-size: 50px;
              cursor: pointer;
              padding: 10px; 
          }
          .price {
              color:blue;
              font-weight:bold
          }
          .title{
              height: 80px;
          }
              
        @media (max-width: 768px) { /* tablet */
          .carousel-title {
            font-size: 18px;
            margin-left: 10px;
          }

          .carousel-container {
            max-width: 100%;
          }

          .product {
            min-width: 120px; 
            margin: 5px;
          }

          .arrow {
            font-size: 40px; 
          }
        }

        @media (max-width: 480px) { /* mobil */
          .carousel-title {
            font-size: 16px;
            margin-left: 10px;
          }

          .product-list {
            flex-direction: column; /* mobil için ürünler alt alta gelsin */
            align-items: center;
          }

          .product {
            min-width: 100%; 
            margin: 5px 0;
          }
          .price {
            margin-bottom: 30px;
          }
          .title{
            height: auto;
          }

          .arrow {
            display: none;
          }   
      `;
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    };
    
    const fetchProducts = async () => {
        let products = JSON.parse(localStorage.getItem("products"));
        const url = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    
        if (!products) {
            try {
                const response = await fetch(url);
                const products = await response.json();
                localStorage.setItem("products", JSON.stringify(products));
                showProductList(products); 
                console.log("API verisi");
            } catch (error) {
                console.error("Ürünler getirilirken hata oluştu", error);
            }
        } else {
            showProductList(products);
            console.log("Local verisi");
        }
    };
    
    
    const showProductList = (products) => {
      const productList = document.querySelector(".product-list");
      const favoriteProducts =
        JSON.parse(localStorage.getItem("favoriteProducts")) || [];
        console.log(favoriteProducts);
  
      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.dataset.productId = product.id;
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}" width="150" />
            <div class="title">${product.name}</div>
            <div class="price">${product.price} TRY</div>
            <div class="heart">${
              favoriteProducts.includes(String(product.id)) ? "\u{1F499}" : "\u{1F90D}"
            }</div>
        `;
        productDiv.onclick = () => {
          window.open(product.url, "_blank");
        };
        productList.appendChild(productDiv);
      });
      setEvents();
    };
  
    const setEvents = () => {
      const leftButton = document.querySelector(".arrow:nth-child(1)"); // firts arrow
      const rightButton = document.querySelector(".arrow:nth-child(3)"); // second arrow
      const productList = document.querySelector(".product-list");
      const hearts = document.querySelectorAll(".heart");

      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          productList.scrollLeft += 175;
        } else if (e.key === "ArrowLeft") {
          productList.scrollLeft -= 175;
        }
      });

      leftButton.addEventListener("click", () => {
        productList.scrollLeft -= 175;
      });
      rightButton.addEventListener("click", () => {
        productList.scrollLeft += 175;
      });
      hearts.forEach((heart, index) => {
        heart.addEventListener("click", (e) => {
          e.stopPropagation();
          const productId =
            document.querySelectorAll(".product")[index].dataset.productId;
          let favoriteProducts =
            JSON.parse(localStorage.getItem("favoriteProducts")) || [];
  
            if (favoriteProducts.includes(productId)) {
              favoriteProducts = favoriteProducts.filter((item) => item !== productId);
            } else {
              favoriteProducts = [...favoriteProducts, productId];
            }
            localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
            heart.textContent = favoriteProducts.includes(productId) ? "\u{1F499}" : "\u{1F90D}";
            
        });
      });
    };
  
    init();
  })();
  