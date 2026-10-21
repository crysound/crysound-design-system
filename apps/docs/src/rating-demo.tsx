import { useState } from "react";
import { Button, Rating } from "../../../packages/ui/src/index";

export function RatingDemo() {
  const [score, setScore] = useState(2);
  return <div className="demo-stack">
    <Rating label="体验评分" value={score} onValueChange={setScore} hint={score ? `已选择 ${score} / 5 星` : "尚未评分"} />
    <div><Button variant="secondary" size="sm" onClick={() => setScore(0)}>清空评分</Button></div>
    <Rating label="未评分" />
    <Rating label="只读评分" value={4} readOnly />
    <Rating label="禁用评分" defaultValue={2} disabled />
    <Rating label="必选评分" required error="请选择评分后继续。" />
    <div className="demo-row">
      <Rating label="小号" size="sm" value={3} readOnly />
      <Rating label="默认" size="md" value={3} readOnly />
      <Rating label="大号" size="lg" value={3} readOnly />
    </div>
  </div>;
}
