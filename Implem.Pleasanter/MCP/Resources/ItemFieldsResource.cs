using ModelContextProtocol.Server;
using System.ComponentModel;

namespace Implem.Pleasanter.MCP.Resources
{
    [McpServerResourceType]
    public static class ItemFieldsResource
    {
        [McpServerResource(
            Name = "item-fields",
            UriTemplate = "resource://pleasanter/specs/item-fields")]
        [Description("レコード操作で使用可能な項目名の一覧と JSON 構造")]
        public static string GetItemFieldsSpec()
        {
            return """
レコード項目のJSON仕様

標準項目: Title(string,タイトル), Body(string,内容), Status(int,状況コード), Manager(int,管理者のユーザーID), Owner(int,担当者のユーザーID), StartTime(string,開始日時), CompletionTime(string,完了日時)

拡張項目(Hash形式,サイトで有効な項目のみ使用可):
ClassHash(ClassA等,string,分類), NumHash(NumA等,number,数値), DateHash(DateA等,string,日付), DescriptionHash(DescriptionA等,string,説明), CheckHash(CheckA等,bool,チェック), AttachmentsHash(AttachmentsA等,array,添付ファイル)

JSON例 - 標準項目: {"Title":"タイトル","Body":"内容","Status":200}
拡張項目: {"ClassHash":{"ClassA":"分類値"},"NumHash":{"NumA":100},"DateHash":{"DateA":"2026/01/15"},"CheckHash":{"CheckA":true},"AttachmentsHash":{"AttachmentsA":[{"Name":"sample.txt","ContentType":"text/plain","Base64":"44K144Oz..."}]}}
複合: {"Title":"タイトル","Status":200,"ClassHash":{"ClassA":"完了","ClassB":"高"},"NumHash":{"NumA":500}}

ManagerとOwnerの区別: Manager=管理者, Owner=担当者。曖昧な表現時はユーザーに確認。どちらもユーザーID(数値)で指定。0で未設定。

注意: JSON項目キーは英語名(Title, ClassHash等)を使用。分類項目はCreateItemJson経由なら日本語表示値→内部コード自動変換あり。直接AddItem/UpdateItemに渡す場合は内部コード指定が必要。

【添付ファイルの指定方法】
CreateItemJson に渡す itemData では、添付ファイル項目を含めて日本語表示名または英語カラム名のどちらかをキーとして使用できます。
値はファイルオブジェクトの配列です。各オブジェクトの仕様:
  Name        : ファイル名（例: "report.pdf"）
  ContentType : MIMEタイプ（例: "text/plain", "application/pdf", "image/png"）
  Base64      : ファイル内容をBase64エンコードした文字列

CreateItemJson 使用例（添付ファイルAに sample.txt を添付）:
  itemData = {
    "タイトル": "テスト",
    "添付ファイルA": [{"Name":"sample.txt","ContentType":"text/plain","Base64":"44K144Oz..."}]
  }

直接 AddItem/UpdateItem に渡す場合の itemDataJson 例（JSON 項目キーは英語カラム名のみ使用）:
  {"Title":"テスト","AttachmentsHash":{"AttachmentsA":[{"Name":"sample.txt","ContentType":"text/plain","Base64":"44K144Oz..."}]}}

複数ファイルの添付: 配列に複数オブジェクトを追加することで複数ファイルを同時に添付可能。
ファイル取得: 任意の手段でファイルを読み取り、内容をBase64エンコードして渡してください。
""";
        }
    }
}
