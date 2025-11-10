-- Function to increment AI credits
CREATE OR REPLACE FUNCTION increment_ai_credits(user_id UUID, credits INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET ai_credits = COALESCE(ai_credits, 0) + credits
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement AI credits
CREATE OR REPLACE FUNCTION decrement_ai_credits(user_id UUID, credits INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT ai_credits INTO current_credits
  FROM users
  WHERE id = user_id;
  
  IF current_credits >= credits THEN
    UPDATE users
    SET ai_credits = ai_credits - credits
    WHERE id = user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_sub BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM user_subscriptions
    WHERE user_subscriptions.user_id = has_active_subscription.user_id
      AND is_active = TRUE
      AND end_date > NOW()
  ) INTO has_sub;
  
  RETURN has_sub;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current package limits
CREATE OR REPLACE FUNCTION get_user_package_limits(user_id UUID)
RETURNS TABLE(
  job_posts_limit INTEGER,
  applications_limit INTEGER,
  ai_credits INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pp.job_posts_limit,
    pp.applications_limit,
    pp.ai_credits
  FROM user_subscriptions us
  JOIN payment_packages pp ON us.package_id = pp.id
  WHERE us.user_id = get_user_package_limits.user_id
    AND us.is_active = TRUE
    AND us.end_date > NOW()
  LIMIT 1;
  
  -- If no active subscription, return default limits
  IF NOT FOUND THEN
    RETURN QUERY SELECT 5, 10, 10;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to deactivate expired subscriptions
CREATE OR REPLACE FUNCTION deactivate_expired_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_subscriptions
  SET is_active = FALSE
  WHERE end_date < NOW() AND is_active = TRUE;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run daily
CREATE OR REPLACE FUNCTION create_subscription_check_trigger()
RETURNS VOID AS $$
BEGIN
  -- This would typically be run by a cron job or scheduled task
  -- For now, we'll just create the function
  PERFORM deactivate_expired_subscriptions();
END;
$$ LANGUAGE plpgsql;
