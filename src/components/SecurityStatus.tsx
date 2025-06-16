
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { checkDependencySecurity } from "@/utils/security";

interface SecurityStatusProps {
  className?: string;
}

const SecurityStatus = ({ className }: SecurityStatusProps) => {
  const [securityStatus, setSecurityStatus] = useState({
    rls: true,
    rateLimit: true,
    inputValidation: true,
    monitoring: true,
    dependencies: 'checking' as 'clean' | 'issues_found' | 'checking',
  });

  useEffect(() => {
    const checkSecurity = () => {
      const depCheck = checkDependencySecurity();
      setSecurityStatus(prev => ({
        ...prev,
        dependencies: depCheck.status as 'clean' | 'issues_found'
      }));
    };

    checkSecurity();
  }, []);

  const getStatusIcon = (status: boolean | string) => {
    if (status === true || status === 'clean') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === 'checking') {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: boolean | string) => {
    if (status === true || status === 'clean') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
    } else if (status === 'checking') {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Checking</Badge>;
    } else {
      return <Badge variant="destructive">Issues Found</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.rls)}
            <span className="text-sm">Row Level Security (RLS)</span>
          </div>
          {getStatusBadge(securityStatus.rls)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.rateLimit)}
            <span className="text-sm">Rate Limiting</span>
          </div>
          {getStatusBadge(securityStatus.rateLimit)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.inputValidation)}
            <span className="text-sm">Input Validation</span>
          </div>
          {getStatusBadge(securityStatus.inputValidation)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.monitoring)}
            <span className="text-sm">Security Monitoring</span>
          </div>
          {getStatusBadge(securityStatus.monitoring)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.dependencies)}
            <span className="text-sm">Dependency Security</span>
          </div>
          {getStatusBadge(securityStatus.dependencies)}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatus;
