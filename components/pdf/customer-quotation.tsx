import logo from "@/app/icon.png";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { QuotationPDFInput } from "./quotation";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
  },
  colSm: {
    border: "1px solid black",
    padding: "2px 4px",
    minWidth: 50,
    textAlign: "center",
    alignItems: "center",
  },
  colProduct: {
    border: "1px solid black",
    padding: "2px 4px",
    width: "100%",
  },
  colMd: {
    border: "1px solid black",
    padding: "2px 4px",
    minWidth: 100,
    textAlign: "center",
    alignItems: "center",
  },
  rowSm: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    padding: "2px 4px",
    minWidth: 50,
    textAlign: "center",
    alignItems: "center",
  },
  rowProduct: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    padding: "2px 4px",
    width: "100%",
  },
  rowMd: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    padding: "2px 4px",
    minWidth: 100,
    textAlign: "center",
    alignItems: "center",
  },
});

const PRODUCTS_PER_PAGE = 22;

export type ProductQuoteType = {
  name: string;
  quantity: number;
  unitPrice: number;
};

const renderTable = (products: ProductQuoteType[]) => (
  <>
    {products.map((p, idx) => (
      <View
        key={idx}
        style={{ flexDirection: "row", minHeight: 16, fontSize: 10 }}
      >
        <View style={styles.rowSm}>
          <Text>{idx + 1}</Text>
        </View>
        <View style={styles.rowProduct}>
          <Text>{p.name}</Text>
        </View>
        <View style={styles.rowSm}>
          <Text>{p.quantity}</Text>
        </View>
        <View style={styles.rowMd}>
          <Text>{p.unitPrice > 0 ? p.unitPrice.toFixed(2) : ""}</Text>
        </View>
        <View style={styles.rowMd}>
          <Text>
            {p.unitPrice > 0 ? (p.quantity * p.unitPrice).toFixed(2) : ""}
          </Text>
        </View>
      </View>
    ))}
  </>
);

export const CustomerQuotation = ({
  products = [],
  subTotal = 99999,
  total = 99999,
  date = "",
  quoteLink = "",
  monthly = 99999,
}: Omit<
  QuotationPDFInput,
  "branch" | "toAddress" | "type" | "isComputerGenerated"
> & { quoteLink?: string; monthly?: number }) => {
  const productPages =
    products.length > 0
      ? Array.from({
          length: Math.ceil(products.length / PRODUCTS_PER_PAGE),
        }).map((_, i) =>
          products.slice(i * PRODUCTS_PER_PAGE, (i + 1) * PRODUCTS_PER_PAGE)
        )
      : [[]];

  const lastPage = productPages.length - 1;
  return (
    <Document>
      {productPages.map((productChunk, pageIdx) => (
        <Page
          key={pageIdx}
          size="A4"
          style={{ padding: "16px", fontSize: 11, position: "relative" }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              paddingBottom: 8,
            }}
          >
            <Image src={logo.src} style={{ height: 80, aspectRatio: "1/1" }} />
            <View style={{ padding: "8px 0px" }}>
              <Text style={{ fontWeight: 700 }}>
                IDEAL TECH PC SDN BHD (BRN: 201401008251)
              </Text>
              <Text>Thank you for using Ideal Tech PC Builder.</Text>
              <Text>We will contact you to proceed with the order soon.</Text>
              <Text>Quotation generated on: {date}</Text>
            </View>
          </View>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 14,
              fontWeight: "bold",
              backgroundColor: "#dedede",
              padding: "4px 0px",
            }}
          >
            Quotation
          </Text>
          {pageIdx === 0 ? (
            <View
              style={{
                width: "100%",
                padding: "16px 16px",
              }}
            >
              <Text style={{ fontWeight: 700 }}>
                Our Aftersales Services cover the following:
              </Text>
              <Text style={{ paddingLeft: "16px" }}>
                1. Lifetime FREE Labor Charges.
              </Text>
              <Text style={{ paddingLeft: "16px" }}>
                2. 90 Days One to One Exchange.
              </Text>
              <Text style={{ paddingLeft: "16px" }}>
                3. FREE On-Site Service / Repair within Klang Valley, Johor,
                Penang.
              </Text>
              <Text style={{ paddingLeft: "16px" }}>
                4. Full Years Warranty Covered. Up to 10 Years.
              </Text>
              <Text style={{ paddingLeft: "16px" }}>
                5. FREE Warranty Pick-Up and Return Covered Whole Malaysia.
              </Text>
              <Text style={{ paddingLeft: "16px" }}>
                6. Lifetime Technical Support.
              </Text>
            </View>
          ) : (
            <View style={{ padding: "8px 0" }}></View>
          )}

          <View
            style={{
              width: "100%",
              flexDirection: "column",
              border: "1px solid black",
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#dedede",
                fontWeight: 700,
              }}
            >
              <View style={styles.colSm}>
                <Text>No.</Text>
              </View>
              <View style={styles.colProduct}>
                <Text>Product</Text>
              </View>
              <View style={styles.colSm}>
                <Text>Qty</Text>
              </View>
              <View style={styles.colMd}>
                <Text>Unit Price (RM)</Text>
              </View>
              <View style={styles.colMd}>
                <Text>Total (RM)</Text>
              </View>
            </View>
            {renderTable(productChunk)}
            <View style={{ flex: 1, flexDirection: "row", minHeight: 16 }}>
              <View style={styles.rowSm}>
                <Text></Text>
              </View>
              <View style={styles.rowProduct}>
                <Text></Text>
              </View>
              <View style={styles.rowSm}>
                <Text></Text>
              </View>
              <View style={styles.rowMd}>
                <Text></Text>
              </View>
              <View style={styles.rowMd}>
                <Text></Text>
              </View>
            </View>
            {pageIdx === productPages.length - 1 && (
              <>
                <View style={{ flexDirection: "row", fontWeight: 700 }}>
                  <View style={styles.colProduct}>
                    <Text>Subtotal: </Text>
                  </View>
                  <View
                    style={{
                      ...styles.colMd,
                      alignItems: "center",
                    }}
                  >
                    <Text>{subTotal.toFixed(2)}</Text>
                  </View>
                </View>
                {subTotal - total > 0 && (
                  <View style={{ flexDirection: "row", fontWeight: 700 }}>
                    <View style={styles.colProduct}>
                      <Text>Discount: </Text>
                    </View>
                    <View
                      style={{
                        ...styles.colMd,
                        alignItems: "center",
                      }}
                    >
                      <Text>{(subTotal - total).toFixed(2)}</Text>
                    </View>
                  </View>
                )}
                <View style={{ flexDirection: "row", fontWeight: 700 }}>
                  <View style={styles.colProduct}>
                    <Text>Total: </Text>
                  </View>
                  <View
                    style={{
                      ...styles.colMd,
                      alignItems: "center",
                    }}
                  >
                    <Text>{total.toFixed(2)}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
          {pageIdx === productPages.length - 1 ? (
            <View
              style={{
                minHeight: 150,
                padding: "16px 0px",
              }}
            >
              <Text style={{ fontWeight: 700 }}>
                Quotation Link: {quoteLink}
              </Text>
              <Text style={{ fontWeight: 700 }}>Installment Options</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: "32px",
                }}
              >
                <View style={{ flex: "80%" }}>
                  <Text style={{ fontWeight: 700 }}>List of Bank:</Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <View style={{ flex: "50%" }}>
                      <Text>Public Bank</Text>
                      <Text>AEON Credit Card</Text>
                      <Text>Affin Bank</Text>
                      <Text>RHB Bank</Text>
                      <Text>AMBANK</Text>
                    </View>
                    <View style={{ flex: "50%" }}>
                      <Text>HSBC</Text>
                      <Text>Standard Charted Bank</Text>
                      <Text>Bank Simpanan Nasional</Text>
                      <Text>OCBC</Text>
                      <Text>UOB</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: "33%",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text>Installment with 12-month</Text>
                  <Text>period starting from</Text>
                  <Text style={{ fontWeight: 700 }}>RM{monthly}/mo</Text>
                  <Text>with listed bank.</Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                minHeight: 150,
                padding: "16px 0px",
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                alignContent: "flex-end",
              }}
            >
              <Text style={{ textAlign: "right" }}>Next page</Text>
            </View>
          )}
          <Text
            style={{
              position: "absolute",
              top: "50%",
              left: "0",
              transform: "translate(0,-50%) rotate(-15deg)",
              fontSize: "80px",
              color: "#999",
              fontWeight: "bold",
              opacity: "0.2",
              zIndex: 0,
              width: "600px",
            }}
          >
            IDEAL TECH PC
          </Text>
        </Page>
      ))}
    </Document>
  );
};
