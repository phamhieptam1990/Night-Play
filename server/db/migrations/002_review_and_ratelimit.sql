-- Thêm kết quả 'duplicate' (đơn đã paid nhưng có thêm một khoản chuyển nữa) và hạn dọn dẹp cho rate_limits.
ALTER TABLE txs DROP CONSTRAINT txs_result_check;
ALTER TABLE txs ADD CONSTRAINT txs_result_check
  CHECK (result IN ('granted','underpaid','unmatched','wrong_account','duplicate'));

ALTER TABLE rate_limits ADD COLUMN expires_at timestamptz NOT NULL DEFAULT now() + interval '1 day';
CREATE INDEX rate_limits_expires_idx ON rate_limits (expires_at);
