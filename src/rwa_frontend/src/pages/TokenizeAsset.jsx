
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, DollarSign, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TokenizeAsset = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: '',
    description: '',
    location: '',
    totalValue: '',
    tokenPrice: '',
    minimumInvestment: '',
    expectedApy: '',
    fundingGoal: '',
    fundingDeadline: '',
    documents: [],
    images: []
  });

  const steps = [
    { id: 1, title: 'Asset Details', icon: FileText },
    { id: 2, title: 'Tokenization', icon: DollarSign },
    { id: 3, title: 'Documentation', icon: Upload },
    { id: 4, title: 'Review & Submit', icon: CheckCircle }
  ];

  const assetTypes = [
    'Real Estate - Residential',
    'Real Estate - Commercial',
    'Art & Collectibles',
    'Commodities',
    'Luxury Items',
    'Intellectual Property',
    'Business Assets',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Asset Submitted Successfully!",
      description: "Your asset tokenization request has been submitted for review. You'll receive updates via email.",
    });
    
    // Simulate navigation to a success page
    setTimeout(() => {
      navigate('/portfolio');
    }, 2000);
  };

  const handleFileUpload = (type) => {
    // Simulate file upload
    const fileName = type === 'document' ? 'valuation_report.pdf' : 'asset_photo.jpg';
    const newFile = {
      id: Date.now(),
      name: fileName,
      type: type,
      size: '2.4 MB',
      status: 'uploaded'
    };

    if (type === 'document') {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newFile]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newFile]
      }));
    }

    toast({
      title: "File Uploaded",
      description: `${fileName} has been uploaded successfully.`,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assetName" className="block text-sm font-medium text-gray-700">Asset Name *</label>
                <input
                  type="text"
                  id="assetName"
                  placeholder="e.g., Manhattan Luxury Apartment"
                  value={formData.assetName}
                  onChange={(e) => handleInputChange('assetName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="assetType" className="block text-sm font-medium text-gray-700">Asset Type *</label>
                <select
                  id="assetType"
                  value={formData.assetType}
                  onChange={(e) => handleInputChange('assetType', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select asset type</option>
                  {assetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
              <input
                type="text"
                id="location"
                placeholder="e.g., New York, NY, USA"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Asset Description *</label>
              <textarea
                id="description"
                placeholder="Provide a detailed description of your asset..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="totalValue" className="block text-sm font-medium text-gray-700">Total Asset Value (USD) *</label>
                <input
                  type="number"
                  id="totalValue"
                  placeholder="e.g., 2500000"
                  value={formData.totalValue}
                  onChange={(e) => handleInputChange('totalValue', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="tokenPrice" className="block text-sm font-medium text-gray-700">Token Price (USD) *</label>
                <input
                  type="number"
                  id="tokenPrice"
                  step="0.01"
                  placeholder="e.g., 1.00"
                  value={formData.tokenPrice}
                  onChange={(e) => handleInputChange('tokenPrice', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minimumInvestment" className="block text-sm font-medium text-gray-700">Minimum Investment (USD) *</label>
                <input
                  type="number"
                  id="minimumInvestment"
                  placeholder="e.g., 100"
                  value={formData.minimumInvestment}
                  onChange={(e) => handleInputChange('minimumInvestment', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="expectedApy" className="block text-sm font-medium text-gray-700">Expected APY (%) *</label>
                <input
                  type="number"
                  id="expectedApy"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  value={formData.expectedApy}
                  onChange={(e) => handleInputChange('expectedApy', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700">Funding Goal (%) *</label>
                <input
                  type="number"
                  id="fundingGoal"
                  placeholder="e.g., 75"
                  value={formData.fundingGoal}
                  onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="fundingDeadline" className="block text-sm font-medium text-gray-700">Funding Deadline *</label>
                <input
                  type="date"
                  id="fundingDeadline"
                  value={formData.fundingDeadline}
                  onChange={(e) => handleInputChange('fundingDeadline', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            {formData.totalValue && formData.tokenPrice && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-semibold mb-2 text-sm">Tokenization Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600">Total Tokens:</span>
                    <span className="ml-2 font-semibold">
                      {Math.floor(formData.totalValue / formData.tokenPrice).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Token Value:</span>
                    <span className="ml-2 font-semibold">${formData.tokenPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-lg flex items-center mb-2">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Documentation
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Upload legal documents, valuations, and certificates
                </p>
                <button
                  onClick={() => handleFileUpload('document')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <Upload className="mr-2 h-4 w-4 text-white" />
                  Upload Documents
                </button>
                
                <div className="mt-4 space-y-2">
                  {formData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-600" />
                        <span>{doc.name}</span>
                      </div>
                      <span className="text-gray-600">{doc.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-lg flex items-center mb-2">
                  <Upload className="mr-2 h-5 w-5 text-green-600" />
                  Images
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Upload high-quality images of your asset
                </p>
                <button
                  onClick={() => handleFileUpload('image')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <Upload className="mr-2 h-4 w-4 text-white" />
                  Upload Images
                </button>
                
                <div className="mt-4 space-y-2">
                  {formData.images.map((img) => (
                    <div key={img.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-sm">
                      <div className="flex items-center">
                        <Upload className="mr-2 h-4 w-4 text-green-600" />
                        <span>{img.name}</span>
                      </div>
                      <span className="text-gray-600">{img.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 text-sm">Required Documents</h4>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                    <li>• Property valuation or appraisal report</li>
                    <li>• Legal ownership documents</li>
                    <li>• Insurance certificates</li>
                    <li>• Financial statements (if applicable)</li>
                    <li>• Compliance and regulatory documents</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h3 className="font-semibold text-lg mb-2">Review Your Asset Tokenization</h3>
              <p className="text-sm text-gray-600 mb-2">
                Please review all information before submitting
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Asset Information</h4>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-gray-600">Name:</span> {formData.assetName}</div>
                    <div><span className="text-gray-600">Type:</span> {formData.assetType}</div>
                    <div><span className="text-gray-600">Location:</span> {formData.location}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Tokenization Details</h4>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-gray-600">Total Value:</span> ${parseInt(formData.totalValue || 0).toLocaleString()}</div>
                    <div><span className="text-gray-600">Token Price:</span> ${formData.tokenPrice}</div>
                    <div><span className="text-gray-600">Expected APY:</span> {formData.expectedApy}%</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-sm">Uploaded Files</h4>
                <div className="text-xs text-gray-600">
                  <div>Documents: {formData.documents.length} files</div>
                  <div>Images: {formData.images.length} files</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            {steps.map((step) => (
              <span key={step.id} className={currentStep >= step.id ? 'text-blue-600 font-medium' : ''}>
                {step.title}
              </span>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
            <div
              className="bg-blue-600 h-1 rounded-full"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <h3 className="font-semibold text-lg mb-2">Step {currentStep}: {steps[currentStep - 1].title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Step {currentStep} of {steps.length}
          </p>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenizeAsset;
