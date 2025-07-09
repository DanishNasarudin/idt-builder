import logo from "@/app/icon.png";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { ReactNode } from "react";

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

type BranchDetailsType = {
  [key: string]: ReactNode;
};

const branchDetails: BranchDetailsType = {
  ampang: (
    <View style={{ padding: "8px 0px" }}>
      <Text style={{ fontWeight: 700 }}>
        IDEAL TECH PC SDN BHD (BRN: 201401008251)
      </Text>
      <Text>
        17, Jalan Pandan Prima 1, Dataran Pandan Prima, 55100 Kuala Lumpur.
      </Text>
      <Text>https://www.idealtech.com.my</Text>
      <Text>Tel: +603-92023137 Email: sales@idealtech.com.my</Text>
      <Text>Sales Enquiry: +6012-5787804 Warranty: +6012-4278782</Text>
    </View>
  ),
  jb: (
    <View style={{ padding: "8px 0px" }}>
      <Text style={{ fontWeight: 700 }}>
        IDEAL TECH PC SDN BHD (BRN: 201401008251)
      </Text>
      <Text>
        53, Jln Austin Height 8/8, Taman Mount Austin, 81100 Johor Bahru.
      </Text>
      <Text>https://www.idealtech.com.my</Text>
      <Text>Email: sales@idealtech.com.my</Text>
      <Text>Sales Enquiry: +6016-8541253</Text>
    </View>
  ),
  sa: (
    <View style={{ padding: "8px 0px" }}>
      <Text style={{ fontWeight: 700 }}>
        IDEAL TECH SERVICES SDN BHD (BRN: 201601018045)
      </Text>
      <Text>
        No. 36G, Jalan Setia Utama U13/AU, Setia Alam Seksyen U13, 40170 Shah
        Alam.
      </Text>
      <Text>https://www.idealtech.com.my</Text>
      <Text>Email: sales@idealtech.com.my</Text>
      <Text>Sales Enquiry: +6012-6101871</Text>
    </View>
  ),
  ss2: (
    <View style={{ padding: "8px 0px" }}>
      <Text style={{ fontWeight: 700 }}>
        IDEAL TECH SERVICES SDN BHD (BRN: 201601018045)
      </Text>
      <Text>42, Jalan SS 2/55, SS 2, 47300 Petaling Jaya.</Text>
      <Text>https://www.idealtech.com.my</Text>
      <Text>Email: sales@idealtech.com.my</Text>
      <Text>Sales Enquiry: +6017-8650076</Text>
    </View>
  ),
};

const branchName = {
  ampang: "IDEAL TECH PC SDN BHD",
  jb: "IDEAL TECH PC SDN BHD",
  sa: "IDEAL TECH SERVICES SDN BHD",
  ss2: "IDEAL TECH SERVICES SDN BHD",
};

const branchMB = {
  ampang: "514383560814 (IDEAL TECH PC SDN BHD)",
  jb: "514383560814 (IDEAL TECH PC SDN BHD)",
  sa: " 514383567728 (IDEAL TECH SERVICES SDN BHD)",
  ss2: " 514383567728 (IDEAL TECH SERVICES SDN BHD)",
};

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

export const Quotation = ({
  branch = "ampang",
  toAddress = `Lorem ipsum dolor sit amet consectetur adipisicing.
              \tConsequatur consequuntur assumenda
              \tatque ipsum laboriosam. Maxime qui rerum necessitatibus ipsam
              \tnesciunt unde a cupiditate vel, sapiente?`,
  date = "99/99/9999",
  type = "Quotation",
  subTotal = 99999,
  total = 99999,
  products = [],
  isComputerGenerated = true,
}: {
  branch?: "ampang" | "jb" | "sa" | "ss2";
  toAddress?: string;
  date?: string;
  type?: string;
  subTotal?: number;
  total?: number;
  products?: ProductQuoteType[];
  isComputerGenerated?: boolean;
}) => {
  const productPages =
    products.length > 0
      ? Array.from({
          length: Math.ceil(products.length / PRODUCTS_PER_PAGE),
        }).map((_, i) =>
          products.slice(i * PRODUCTS_PER_PAGE, (i + 1) * PRODUCTS_PER_PAGE)
        )
      : [[]];

  return (
    <Document>
      {productPages.map((productChunk, pageIdx) => (
        <Page key={pageIdx} size="A4" style={{ padding: "16px", fontSize: 11 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              paddingBottom: 8,
            }}
          >
            <Image src={logo.src} style={{ height: 80, aspectRatio: "1/1" }} />
            {branchDetails[branch]}
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
            {type}
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              padding: "32px 0px",
            }}
          >
            <View style={{ minWidth: 50 }}>
              <Text style={{ fontWeight: 700 }}>To</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ maxWidth: 350 }}>{toAddress}</Text>
            </View>
            <View style={{ minWidth: 120 }}>
              <Text
                style={{ fontWeight: 700, justifyContent: "space-between" }}
              >
                Date: {date}
              </Text>
            </View>
          </View>
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
          <View
            style={{
              flexDirection: "row",
              minHeight: 150,
              padding: "16px 0px",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text>Maybank Acc: {branchMB[branch]}</Text>
            </View>
            <View
              style={{
                minWidth: 200,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {isComputerGenerated ? (
                <>
                  <Text>This is a system generated</Text>
                  <Text>{type.toLowerCase()}, no signature required.</Text>
                </>
              ) : (
                <>
                  <Text>
                    ..................................................
                  </Text>
                  <Text>{branchName[branch]}</Text>
                </>
              )}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};
